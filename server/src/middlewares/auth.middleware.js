import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.setup.js";
import { isSessionActive } from "../utils/token.util.js";
import { User } from "../models/user.model.js";

export const rateLimitMiddleware =
  ({ prefix }) =>
  async (req, res, next) => {
    const userIdentifier = `${req.ip}:${req.body?.email || "unknown"}`;
    const limit = 10; // Maximum requests allowed
    const windowInSeconds = 60;

    try {
      // Increment the counter for the user's key
      const key = `ga:${prefix}:${userIdentifier}`;
      const currentRequests = await redisClient.incr(key);

      // If it's the first request, set the expiration time for the key
      if (currentRequests === 1) {
        await redisClient.expire(key, windowInSeconds);
      }

      // Check if the request limit has been exceeded
      if (currentRequests > limit) {
        // Get the remaining time until reset
        const ttl = await redisClient.ttl(key);
        return res.status(429).json({
          message: "Too many requests. Please try again after some time.",
          retryAfter: ttl, // Time until the limit resets
        });
      }

      // If within limits, proceed to the route handler
      next();
    } catch (error) {
      console.error("Redis error:", error);
      res.status(500).json({ message: "Internal server error:(" });
    }
  };

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(403).json({ message: "Please login - no token" });
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedData) {
      return res.status(400).json({ message: "Token expired." });
    }

    // checking session
    const sessionActive = await isSessionActive(
      decodedData.userId,
      decodedData.sessionId,
    );

    if (!sessionActive) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.clearCookie("csrfToken");

      return res.status(401).json({
        message:
          "Session Expired. You have been logged in from another device.",
      });
    }

    // caching user in redis (not fetching users from the database continously because then it will put load in sv)

    const cacheUser = await redisClient.get(`ga:cached_user:${decodedData.userId}`);

    if (cacheUser) {
      req.user = JSON.parse(cacheUser);
      req.sessionId = decodedData.sessionId;
      return next();
    }

    // if we didnt find in cache, then we will cache it
    const user = await User.findById(decodedData.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "No user with this id." });
    }

    await redisClient.setEx(`ga:cached_user:${user._id}`, 3600, JSON.stringify(user));

    req.user = user;
    req.sessionId = decodedData.sessionId;
    next();
  } catch (error) {
    return res.status(500).json({ message: `Oops, isAuth error. ${error.message}` });
  }
};

export const verifyCSRFToken = async (req, res, next) => {
  try {
    if (req.method === "GET") {
      return next();
    }

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const clientToken = req.headers["x-csrf-token"] || req.cookies.csrfToken;
    const csrfKey = `ga:csrf_token:${userId}`;
    const storedToken = await redisClient.get(csrfKey);

    if (req.path === "/logout") {
      if (storedToken && clientToken !== storedToken) {
        return res.status(403).json({
          message: "Invalid CSRF Token.",
          code: "CSRF_TOKEN_INVALID",
        });
      }
      // Missing or expired token → allow logout
      return next();
    }

    if (!clientToken) {
      return res.status(403).json({
        message: "CSRF Token missing.",
        code: "CSRF_TOKEN_MISSING",
      });
    }

    if (storedToken !== clientToken) {
      return res.status(403).json({
        message: "Invalid CSRF Token.",
        code: "CSRF_TOKEN_INVALID",
      });
    }

    next();
  } catch (error) {
    console.log("CSRF Verification error:", error);
    return res.status(500).json({
      message: "CSRF verification failed.",
      code: "CSRF_VERIFICATION_ERROR",
    });
  }
};