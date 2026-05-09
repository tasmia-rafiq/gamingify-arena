import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes import
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import categoryRoutes from "./routes/category.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
}));

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/posts/", postRoutes);
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/users/", userRoutes);

// for monitoring
app.get("/api/v1/monitor", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

export default app;