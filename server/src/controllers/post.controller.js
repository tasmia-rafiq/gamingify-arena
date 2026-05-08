import TryCatch from "../middlewares/TryCatch.js";
import { Post } from "../models/post.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { uploadImage, deleteImage } from "../utils/cloudinary.util.js";

// ────── Constants ──────

const HOME_CATEGORY_SLUGS = ["news", "reviews", "tips-and-guides"];

const LIST_SELECT = "-content";
const CARD_SELECT = "-summary -content";

const AUTHOR_SELECT = "username fullname";
const CATEGORY_SELECT = "name slug";

// ────── Helpers ──────
const buildPostQuery = ({
  filter,
  select,
  limit,
  skip,
  sort = { createdAt: -1 },
}) =>
  Post.find(filter)
    .select(select)
    .populate("author", AUTHOR_SELECT)
    .populate("categories", CATEGORY_SELECT)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

// ────── CONTROLLERS ──────
export const createPost = TryCatch(async (req, res) => {
  const { title, summary, categories, content } = req.body;

  if (!req.file)
    return res.status(400).json({ message: "Cover image is required." });

  // validate that the submitted category IDs actually exist in the DB
  const categoryIds = Array.isArray(categories) ? categories : [categories];
  const validCategories = await Category.find({
    _id: { $in: categoryIds },
    isActive: true,
  }).select("_id");

  if (validCategories.length !== categoryIds.length) {
    return res
      .status(400)
      .json({ message: "One or more selected categories are invalid." });
  }

  // store public_id alongside URL so images can be deleted/replaced later
  const { url: coverImageUrl, public_id: coverImagePublicId } =
    await uploadImage(req.file);

  const post = await Post.create({
    title,
    summary,
    categories,
    coverImage: coverImageUrl,
    coverImagePublicId,
    author: req.user._id,
    content,
  });
  res.status(201).json({
    message: "Blog created successfully.",
    post,
  });
});

export const getHomePageData = TryCatch(async (req, res) => {
  const categories = await Category.find({
    slug: { $in: HOME_CATEGORY_SLUGS },
    isActive: true,
  })
    .select("_id slug")
    .lean();

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat._id;
    return acc;
  }, {});

  const published = { isPublished: true };

  const buildHomepageQuery = (extraFilter, select) =>
    buildPostQuery({
      filter: { ...published, ...extraFilter },
      select,
      sort: { createdAt: -1 },
      skip: 0,
      limit: 4,
    });

  // All 4 queries run in parallel — no waterfalling
  const [latest, news, reviews, tips] = await Promise.all([
    buildPostQuery({
      filter: published,
      select: LIST_SELECT,
      sort: { createdAt: -1 },
      skip: 0,
      limit: 4,
    }),
    categoryMap["news"]
      ? buildHomepageQuery({ categories: categoryMap["news"] }, CARD_SELECT)
      : Promise.resolve([]),
    categoryMap["reviews"]
      ? buildHomepageQuery({ categories: categoryMap["reviews"] }, CARD_SELECT)
      : Promise.resolve([]),
    categoryMap["tips-and-guides"]
      ? buildHomepageQuery(
          { categories: categoryMap["tips-and-guides"] },
          CARD_SELECT,
        )
      : Promise.resolve([]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      latest,
      news,
      reviews,
      tips,
    },
  });
});

export const getPosts = TryCatch(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 6)); // max 50 per page
  const { category, search, sort = "latest", author } = req.query;

  const filter = { isPublished: true };

  if (category) {
    // cache-friendly — could be moved to a service layer with Redis later
    const categoryDoc = await Category.findOne({
      slug: category,
      isActive: true,
    }).select("_id");

    if (!categoryDoc) {
      // Return empty result set instead of 404 — better UX for unknown slugs
      return res.status(200).json({
        success: true,
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      });
    }
    filter.categories = categoryDoc._id;
  }

  if (search) {
    // using MongoDB $text search instead of $regex. $regex on large collections causes full collection scans; $text uses the index
    filter.$text = { $search: search };
  }

  if (author) {
    // author can be ObjectId or username — resolve to ObjectId
    let authorId = null;
    if (mongoose.Types.ObjectId.isValid(author)) {
      authorId = author;
    } else {
      const userDoc = await User.findOne({ username: author }).select("_id");
      if (!userDoc) {
        // return empty set
        return res.status(200).json({
          success: true,
          data: [],
          meta: { total: 0, page, limit, totalPages: 0 },
        });
      }
      authorId = userDoc._id;
    }

    filter.author = authorId;
  }

  const sortOptions =
    sort === "oldest"
      ? { createdAt: 1 }
      : sort === "popular"
        ? { viewCount: -1, createdAt: -1 } // popularity sort
        : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    buildPostQuery({
      filter,
      select: LIST_SELECT,
      sort: sortOptions,
      skip,
      limit,
    }),
    Post.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  });
});

/**
 * Get Single Post by Slug
 * GET /api/v1/posts/:slug
 */
export const getPostBySlug = TryCatch(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOneAndUpdate(
    { slug, isPublished: true },
    { $inc: { viewCount: 1 } },
    { new: true },
  )
    .populate("author", AUTHOR_SELECT)
    .populate("categories", CATEGORY_SELECT)
    .lean();

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Blog not found.",
    });
  }

  return res.status(200).json({
    success: true,
    data: post,
  });
});

/**
 * Delete Single Post by Slug
 * DELETE /api/v1/posts/:slug
 */
export const deletePost = TryCatch(async (req, res) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug }).select(
    "_id author coverImagePublicId",
  );

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this post.",
    });
  }

  if (post.coverImagePublicId) {
    try {
      await deleteImage(post.coverImagePublicId);
    } catch (cloudinaryError) {
      console.error(
        `[Cloudinary] Cleanup failed for post ${post._id}:`,
        cloudinaryError.message,
      );
    }
  }

  await Post.findByIdAndDelete(post._id);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

/**
 * Update Single Post by Slug
 * PATCH /api/v1/posts/:slug
 */
export const updatePost = TryCatch(async (req, res) => {
  const { slug } = req.params;
  const { title, summary, categories, content } = req.body;

  const post = await Post.findOne({ slug });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  // ownership check
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to edit this post.",
    });
  }

  // Validate submitted categories exist and are active
  const categoryIds = Array.isArray(categories) ? categories : [categories];
  const validCategories = await Category.find({
    _id: { $in: categoryIds },
    isActive: true,
  }).select("_id");
 
  if (validCategories.length !== categoryIds.length) {
    return res.status(400).json({
      success: false,
      message: "One or more selected categories are invalid.",
    });
  }

  post.title = title;
  post.summary = summary;
  post.categories = categories;
  post.content = content;

  // cover image replacement
  if (req.file) {
    const { url: newCoverImageUrl, public_id: newCoverImagePublicId } = await uploadImage(req.file);

    // cleanup: delete the old image from Cloudinary.
    if (post.coverImagePublicId) {
      try {
        await deleteImage(post.coverImagePublicId);
      } catch (cloudinaryError) {
        console.error(
          `[Cloudinary] Failed to delete old cover image for post ${post._id}:`,
          cloudinaryError.message
        );
      }
    }

    // Replace with the new image
    post.coverImage = newCoverImageUrl;
    post.coverImagePublicId = newCoverImagePublicId;
  }

  await post.save();

  return res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post,
  });
});
