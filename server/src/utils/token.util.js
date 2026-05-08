import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { redisClient } from "../config/redis.setup.js";

export const passwordHashing = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
export const generateEmailToken = () => {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyHashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  return { verifyToken, verifyHashedToken };
};

export const generateAccessToken = (userId, sessionId) => {
  return jwt.sign({ userId, sessionId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign({ userId, sessionId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const generateCSRFToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const generateSessionId = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await redisClient.get(
      `ga:refresh_token:${payload.userId}`,
    );

    if (storedToken !== refreshToken) return null;

    const activeSessionId = await redisClient.get(
      `ga:active_session:${payload.userId}`,
    );

    if (activeSessionId !== payload.sessionId) return null;

    const sessionData = await redisClient.get(
      `ga:session:${payload.sessionId}`,
    );

    if (!sessionData) return null;

    const parsedSessionData = JSON.parse(sessionData);
    parsedSessionData.lastActivity = new Date().toISOString();
    await redisClient.setEx(
      `ga:session:${payload.sessionId}`,
      7 * 24 * 60 * 60 * 1000,
      JSON.stringify(parsedSessionData),
    );

    return payload;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (userId) => {
  try {
    await redisClient.del(`ga:refresh_token:${userId}`);

    const activeSessionId = await redisClient.get(`ga:active_session:${userId}`);
    await redisClient.del(`ga:active_session:${userId}`);

    if (activeSessionId) await redisClient.del(`ga:session:${activeSessionId}`);
  } catch (error) {
    console.log("Error revoking!", error);
  }
};

export const revokeCSRFToken = async (userId) => {
  const csrfKey = `ga:csrf_token:${userId}`;
  await redisClient.del(csrfKey);
};

export const isSessionActive = async (userId, sessionId) => {
  const activeSessionId = await redisClient.get(`ga:active_session:${userId}`);
  return activeSessionId === sessionId;
}