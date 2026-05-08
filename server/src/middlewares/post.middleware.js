import rateLimit from "express-rate-limit";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

// ─────────── Rate Limiters ───────────

// limit post creation — prevents spam/abuse. 10 posts per hour per IP is generous for a legitimate user
export const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: "Too many posts submitted. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Lighter limit on read endpoints — prevents scraping/DoS
export const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { success: false, message: "Too many requests. Slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});