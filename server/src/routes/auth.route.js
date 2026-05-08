import Router from "express";
import { checkUsernameAvailability, forgotPassword, loginUser, logout, refreshAccessToken, refreshCSRFToken, registerUser, resetPassword, userInfo, verifyUser, googleAuthRedirect, googleAuthCallback } from "../controllers/auth.controller.js";
import { isAuth, rateLimitMiddleware, verifyCSRFToken } from "../middlewares/auth.middleware.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { validateRequest } from "../middlewares/validation.middleware.js";

const router = Router();

router.post(
    "/register",
    validateRequest(registerSchema),
    rateLimitMiddleware({ prefix: "register-rate-limit" }),
    registerUser
);

router.post(
    "/verify-email/:token",
    verifyUser
);

router.post(
    "/login",
    validateRequest(loginSchema),
    rateLimitMiddleware({ prefix: "login-rate-limit" }),
    loginUser
);

router.post(
    "/refresh-token",
    refreshAccessToken
);

router.post(
    "/refresh-csrf",
    isAuth,
    refreshCSRFToken
);

router.post(
    "/logout",
    isAuth,
    verifyCSRFToken,
    logout
);

router.get("/check-username", checkUsernameAvailability);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/user-info", isAuth, userInfo);

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;