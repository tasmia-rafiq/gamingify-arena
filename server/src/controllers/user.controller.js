import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";

// Get public profile by id
export const getUserProfile = TryCatch(async (req, res) => {
  const { id } = req.params; // may be an ObjectId or a username

  let user = null;

  // Try find by ObjectId if valid
  if (mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id)
      .select("fullname username bio avatar followers following createdAt")
      .lean();
  }

  // If not found by id, try username lookup
  if (!user) {
    user = await User.findOne({ username: id })
      .select("fullname username bio avatar followers following createdAt")
      .lean();
  }

  if (!user) return res.status(404).json({ message: "User not found." });

  const userId = user._id;

  // fetch user's posts count and recent posts
  const posts = await Post.find({ author: userId, isPublished: true })
    .select("title slug coverImage createdAt")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return res.status(200).json({
    success: true,
    data: {
      user,
      posts,
      counts: {
        posts: posts.length,
        followers: (user.followers || []).length,
        following: (user.following || []).length,
      },
    },
  });
});

// Follow a user
export const followUser = TryCatch(async (req, res) => {
  const identifier = req.params.id;
  const currentUserId = req.user._id.toString();

  // resolve target by id or username
  let target = null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    target = await User.findById(identifier);
  }
  if (!target) {
    target = await User.findOne({ username: identifier });
  }

  if (!target) return res.status(404).json({ message: "User not found." });

  const targetId = target._id.toString();

  if (targetId === currentUserId)
    return res.status(400).json({ message: "Cannot follow yourself." });

  const current = await User.findById(currentUserId);

  // add to sets (handle ObjectId -> string comparison)
  if (!Array.isArray(target.followers) || !target.followers.some((f) => f.toString() === currentUserId)) {
    target.followers = target.followers || [];
    target.followers.push(currentUserId);
    await target.save();
  }

  if (!Array.isArray(current.following) || !current.following.some((f) => f.toString() === targetId)) {
    current.following = current.following || [];
    current.following.push(target._id);
    await current.save();
  }

  return res.status(200).json({
    success: true,
    message: "Followed user.",
    data: {
      followers: target.followers.length,
      following: current.following.length,
    },
  });
});

// Unfollow a user
export const unfollowUser = TryCatch(async (req, res) => {
  const identifier = req.params.id;
  const currentUserId = req.user._id.toString();

  // resolve target by id or username
  let target = null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    target = await User.findById(identifier);
  }
  if (!target) {
    target = await User.findOne({ username: identifier });
  }

  if (!target) return res.status(404).json({ message: "User not found." });

  const targetId = target._id.toString();

  if (targetId === currentUserId)
    return res.status(400).json({ message: "Cannot unfollow yourself." });

  const current = await User.findById(currentUserId);

  target.followers = (target.followers || []).filter((f) => f.toString() !== currentUserId);
  current.following = (current.following || []).filter((f) => f.toString() !== target._id.toString());

  await target.save();
  await current.save();

  return res.status(200).json({
    success: true,
    message: "Unfollowed user.",
    data: {
      followers: target.followers.length,
      following: current.following.length,
    },
  });
});
