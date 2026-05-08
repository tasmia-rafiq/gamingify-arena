import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "At least one category is required"],
      },
    ],
    coverImage: {
      type: String,
      required: true,
    },

    // Cloudinary public_id for deletion/replacement later
    coverImagePublicId: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    // useful for trending/popular sort later
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// ─── Indexes ───

// Most common query: published posts sorted by newest
postSchema.index({ isPublished: 1, createdAt: -1 });

// Category feed queries
postSchema.index({ categories: 1, isPublished: 1, createdAt: -1 });

// Text search on title + summary
postSchema.index({ title: "text", summary: "text" });

// Slug generation
postSchema.pre("save", async function () {
  if (!this.isModified("title") && !this.isNew) return;

  const baseSlug = slugify(this.title, { lower: true, strict: true });

  // prevents silent collisions when two posts share a similar title
  let slug = baseSlug;
  let exists = await mongoose.models.Post.findOne({
    slug,
    _id: { $ne: this._id },
  });

  if (exists) {
    slug = `${baseSlug}-${Date.now().toString(36)}`;
  }

  this.slug = slug;
});

export const Post = mongoose.model("Post", postSchema);
