// src/routes/auth.js
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signAccessToken, signRefreshToken, verifyToken } = require("../config/jwt");
const { registerValidators, loginValidators } = require("../middleware/validation");
const { body } = require("express-validator");
const router = express.Router();

// Simple in-memory refresh token store (for demo). Replace with DB in prod.
const refreshTokenStore = new Set();

/**
 * POST /api/v1/auth/register
 * creates user, returns access token + refresh token in httpOnly cookie
 */
router.post("/register", registerValidators, async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = new User({ username, email, password, firstName, lastName });
    await user.save();

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });
    refreshTokenStore.add(refreshToken);

    // set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // match REFRESH_TOKEN_EXPIRES_IN
    });

    res.status(201).json({ token: accessToken, user: { id: user._id, username, email, firstName, lastName, role: user.role } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/login
 * Accepts identifier(email|username) + password, returns access token + refresh cookie
 */
router.post("/login", loginValidators, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });
    refreshTokenStore.add(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({ token: accessToken, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/auth/refresh
 * Issues new access token using a valid refresh token cookie
 */
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });
    if (!refreshTokenStore.has(token)) return res.status(403).json({ error: "Refresh token revoked" });

    const decoded = verifyToken(token);
    const accessToken = signAccessToken({ id: decoded.id });
    res.json({ token: accessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

/**
 * POST /api/v1/auth/logout
 * Revoke refresh token and clear cookie
 */
router.post("/logout", (req, res) => {
  const token = req.cookies.refreshToken;
  if (token && refreshTokenStore.has(token)) refreshTokenStore.delete(token);
  res.clearCookie("refreshToken");
  res.json({ ok: true });
});

/**
 * GET /api/v1/auth/profile
 * Protected route - must send Authorization: Bearer <token>
 */
const { requireAuth } = require("../middleware/auth");
router.get("/profile", requireAuth, async (req, res) => {
  const user = req.user;
  res.json({ user: { id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
});

/**
 * PUT /api/v1/auth/change-password
 * requires currentPassword + newPassword
 */
router.put(
  "/change-password",
  requireAuth,
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }),
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(401).json({ error: "Current password incorrect" });

    user.password = newPassword; // will be hashed in pre-save hook
    await user.save();
    res.json({ ok: true });
  }
);

module.exports = router;
