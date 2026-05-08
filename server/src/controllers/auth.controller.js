import crypto from "crypto";
import bcrypt from "bcryptjs";
import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateCSRFToken,
  generateEmailToken,
  generateRefreshToken,
  generateSessionId,
  passwordHashing,
  revokeCSRFToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util.js";
import { redisClient } from "../config/redis.setup.js";
import sendMail from "../config/sendMail.js";
import { getPasswordResetHtml, getVerifyEmailHtml } from "../config/mailHtml.js";
import { tokenCookieOptions } from "../utils/cookie.util.js";

export const registerUser = TryCatch(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res
      .status(400)
      .json({ message: "A user with this email already exists." });

  // hash password
  const hashedPassword = await passwordHashing(password);

  const { verifyToken, verifyHashedToken } = generateEmailToken();

  const verifyKey = `ga:verify:${verifyHashedToken}`;

  const dataToStore = JSON.stringify({
    fullname,
    username,
    email,
    password: hashedPassword,
  });

  await redisClient.set(verifyKey, dataToStore, { EX: 600 });

  await sendMail({
    to: email,
    subject: "Verify your email for account creation.",
    html: getVerifyEmailHtml({ email, token: verifyToken }),
  });

  return res.status(201).json({
    message:
      "If your email is valid, a verification link has been sent. It will expire in 10 minutes.",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token)
    return res.status(400).json({ message: "Verification link is required." });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const verifyKey = `ga:verify:${hashedToken}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson)
    return res.status(400).json({
      message: "Verification link is expired!",
    });

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    await redisClient.del(verifyKey);
    return res.status(200).json({
      message: "Email has been already verified. Login in to your account.",
    });
  }

  const newUser = await User.create({
    fullname: userData.fullname,
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  await redisClient.del(verifyKey);

  res.status(201).json({
    message:
      "Email verified successfully! Your account has been created. Login to your account now.",
    user: {
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid Credentials." });

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched)
    return res.status(401).json({ message: "Invalid Credentials." });

  const sessionId = generateSessionId();
  const accessToken = generateAccessToken(user._id, sessionId);
  const refreshToken = generateRefreshToken(user._id, sessionId);
  const csrfToken = generateCSRFToken();

  // saving refresh and csrf tokens in redis
  const refreshTokenKey = `ga:refresh_token:${user._id}`;
  const csrfKey = `ga:csrf_token:${user._id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);
  await redisClient.setEx(csrfKey, 7 * 24 * 60 * 60, csrfToken);

  // creating session
  const activeSessionKey = `ga:active_session:${user._id}`;
  const sessionDataKey = `ga:session:${sessionId}`;

  const existingSession = await redisClient.get(activeSessionKey);
  if (existingSession) {
    await redisClient.del(`ga:session:${existingSession}`);
    await redisClient.del(refreshToken);
  }

  const sessionData = {
    userId: user._id,
    sessionId,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };
  await redisClient.setEx(
    sessionDataKey,
    7 * 24 * 60 * 60,
    JSON.stringify(sessionData),
  );
  await redisClient.setEx(activeSessionKey, 7 * 24 * 60 * 60, sessionId);

  // setting cookies
  res.cookie("accessToken", accessToken, tokenCookieOptions(15 * 60 * 1000));
  res.cookie(
    "refreshToken",
    refreshToken,
    tokenCookieOptions(7 * 24 * 60 * 60 * 1000),
  );
  res.cookie("csrfToken", csrfToken, tokenCookieOptions(7 * 24 * 60 * 60 * 1000));

  res.status(200).json({
    message: "You are logged in successfully.",
    user: {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    },
    sessionInfo: {
      sessionId: sessionData.sessionId,
      loginTime: new Date().toISOString(),
      csrfToken: csrfToken,
      accessToken: accessToken,
    },
  });
});

export const refreshAccessToken = TryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Invalid Refresh Token." });

  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");
    return res.status(401).json({ message: "Session expired! Please login." });
  }

  // rotate refresh token
  const newAccessToken = generateAccessToken(decode.userId, decode.sessionId);

  res.cookie("accessToken", newAccessToken, tokenCookieOptions(15 * 60 * 1000));
  res.status(200).json({
    message: "Token refreshed",
    accessToken: newAccessToken,
  });
});

export const logout = TryCatch(async (req, res) => {
  const userId = req.user?._id;
  if (userId) {
    await revokeRefreshToken(userId);
    await revokeCSRFToken(userId);
    await redisClient.del(`ga:cached_user:${userId}`);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  res.status(200).json({
    message: "Logged out successfully!",
  });
});

export const refreshCSRFToken = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const newCSRFToken = generateCSRFToken();

  const csrfKey = `ga:csrf_token:${userId}`;

  await redisClient.setEx(csrfKey, 7 * 24 * 60 * 60, newCSRFToken);

  res.cookie("csrfToken", newCSRFToken, tokenCookieOptions(7 * 24 * 60 * 60 * 1000));

  res.status(200).json({
    message: "CSRF token refreshed successfully!",
    csrfToken: newCSRFToken,
  });
});

export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;

    const user = User.findOne({ email });
    if (!user) return res.status(200).json({ message: "If an account with this email exists, a reset link has been sent." });

    const { verifyToken } = generateEmailToken();
    const resetTokenKey = `ga:password_reset:${verifyToken}`;

    await redisClient.set(
      resetTokenKey,
      user._id.toString(),
      { EX: 900 }, // 15 mins
    );

    await sendMail({
      to: email,
      subject: "Reset your password.",
      html: getPasswordResetHtml({ email, token: verifyToken }),
    });

    return res.status(200).json({
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });
});

export const resetPassword = TryCatch(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetTokenKey = `ga:password_reset:${token}`;
    const userId = await redisClient.get(resetTokenKey);

    if (!userId) {
      return res.status(400).json({
        message: "Reset link is invalid or expired.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      await redisClient.del(resetTokenKey);
      return res.status(400).json({ message: "Invalid reset link." });
    }

    const hashedPassword = await passwordHashing(password);
    user.password = hashedPassword;
    await user.save();
    await redisClient.del(resetTokenKey);

    return res.status(200).json({
      message: "Password reset successfully. Please login again.",
    });
});

export const checkUsernameAvailability = TryCatch(async (req, res) => {
    const { username } = req.body;
    if (!username || username.length < 3) {
      return res.status(400).json({ available: false });
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() }).select("_id");
    
    return res.status(200).json({
        available: !existingUsername, 
    });
});

export const userInfo = TryCatch(async (req, res) => {
    const user = req.user;
    const sessionId = req.sessionId;
    const sessionData = await redisClient.get(`ga:session:${sessionId}`);
    let sessionInfo = null;

    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      sessionInfo = {
        sessionId,
        loginTime: parsedSession.createdAt,
        lastActivity: parsedSession.lastActivity,
      };
    }
    res.json({ user, sessionInfo });
});

// Start Google OAuth by redirecting user to Google's consent screen
export const googleAuthRedirect = TryCatch(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.redirect(url);
});

// Google OAuth callback: exchange code for tokens, fetch profile, create or login user
export const googleAuthCallback = TryCatch(async (req, res) => {
  const code = req.query.code;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  if (!code) return res.redirect(`${frontendUrl}/auth/oauth-callback?error=${encodeURIComponent("Missing code from Google callback.")}`);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  const idToken = tokenJson.id_token;

  if (!accessToken) return res.redirect(`${frontendUrl}/auth/oauth-callback?error=${encodeURIComponent("Failed to obtain access token from Google.")}`);

  // fetch userinfo
  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = await userInfoRes.json();
  // profile contains: id, email, verified_email, name, given_name, family_name, picture, locale

  if (!profile?.email) return res.redirect(`${frontendUrl}/auth/oauth-callback?error=${encodeURIComponent("Google profile did not include an email.")}`);

  // check existing user by email
  let user = await User.findOne({ email: profile.email });

  if (user) {
    // if user registered locally, disallow Google sign-in using same email
    if ((user.provider || 'local') === 'local') {
      return res.redirect(`${frontendUrl}/auth/oauth-callback?error=${encodeURIComponent("An account with this email already exists. Please sign in using email/password.")}`);
    }
    // else user exists and is google provider -> login
  } else {
    // Create new user
    // generate unique username from email local part
    const localPart = profile.email.split("@")[0].replace(/[^a-z0-9._-]/gi, '').toLowerCase();
    let usernameCandidate = localPart;
    let counter = 0;
    while (await User.findOne({ username: usernameCandidate })) {
      counter++;
      usernameCandidate = `${localPart}${counter}`;
    }

    user = await User.create({
      fullname: profile.name || profile.email,
      username: usernameCandidate,
      email: profile.email,
      provider: 'google',
      googleId: profile.id,
      avatar: profile.picture,
      password: null,
    });
  }

  // create session and tokens (same as loginUser)
  const sessionId = generateSessionId();
  const accessTokenJwt = generateAccessToken(user._id, sessionId);
  const refreshToken = generateRefreshToken(user._id, sessionId);
  const csrfToken = generateCSRFToken();

  const refreshTokenKey = `ga:refresh_token:${user._id}`;
  const csrfKey = `ga:csrf_token:${user._id}`;

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);
  await redisClient.setEx(csrfKey, 7 * 24 * 60 * 60, csrfToken);

  const activeSessionKey = `ga:active_session:${user._id}`;
  const sessionDataKey = `ga:session:${sessionId}`;
  const existingSession = await redisClient.get(activeSessionKey);
  if (existingSession) {
    await redisClient.del(`ga:session:${existingSession}`);
    await redisClient.del(existingSession);
  }

  const sessionData = {
    userId: user._id,
    sessionId,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  await redisClient.setEx(sessionDataKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData));
  await redisClient.setEx(activeSessionKey, 7 * 24 * 60 * 60, sessionId);

  // set cookies and redirect to frontend home
  res.cookie("accessToken", accessTokenJwt, tokenCookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, tokenCookieOptions(7 * 24 * 60 * 60 * 1000));
  res.cookie("csrfToken", csrfToken, tokenCookieOptions(7 * 24 * 60 * 60 * 1000));

  // redirect back to frontend (can be configured)
  return res.redirect(frontendUrl + "/");
});