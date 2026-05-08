import Router from "express";
import { isAuth, verifyCSRFToken } from "../middlewares/auth.middleware.js";
import { createPostLimiter, readLimiter, uploadMiddleware } from "../middlewares/post.middleware.js";
import { createPost, deletePost, getHomePageData, getPostBySlug, getPosts, updatePost } from "../controllers/post.controller.js";
const router = Router();

// Read routes
router.get("/", readLimiter, getPosts);
router.get("/home", readLimiter, getHomePageData);

router.get("/:slug", readLimiter, getPostBySlug);

// Protected write route
router.post(
    "/create",
    isAuth,
    verifyCSRFToken,
    createPostLimiter,
    uploadMiddleware.single("coverImage"),
    createPost
);

router.delete(
    "/:slug",
    isAuth,
    verifyCSRFToken,
    deletePost,
);

router.patch(
    "/:slug",
    isAuth,
    verifyCSRFToken,
    uploadMiddleware.single("coverImage"),
    updatePost,
);

export default router;