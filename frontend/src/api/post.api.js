import api from "./axios";

// GET POSTS
export const fetchPosts = (params) => api.get("/api/v1/posts", { params });
export const fetchHomePosts = () => api.get("/api/v1/posts/home");
export const fetchPostBySlug = (slug) => api.get(`/api/v1/posts/${slug}`);

// WRITE POSTS
export const createPost = (formData) =>
  api.post("/api/v1/posts/create", formData);

export const deletePost = (slug) => api.delete(`/api/v1/posts/${slug}`);

export const updatePost = (slug, formData) => api.patch(`/api/v1/posts/${slug}`, formData);