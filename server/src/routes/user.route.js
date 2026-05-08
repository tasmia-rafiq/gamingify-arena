import Router from "express";
import { getUserProfile, followUser, unfollowUser } from "../controllers/user.controller.js";
import { isAuth, verifyCSRFToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id", getUserProfile);
router.post("/:id/follow", isAuth, followUser);
router.post("/:id/unfollow", isAuth, unfollowUser);

export default router;
