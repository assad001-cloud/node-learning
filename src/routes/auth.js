// src/routes/auth.js
const express = require("express");
const router = express.Router();
const { signToken } = require("../config/jwt");
const User = require("../models/User");
const Book = require("../models/Book");
const { validateUserRegistration } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");

// Register
router.post("/register", validateUserRegistration, async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    // uniqueness handled by DB (duplicate key)
    const user = new User({ username, email, password, firstName, lastName });
    await user.save();
    const token = signToken({ id: user._id });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    next(err);
  }
});

// Login (by email or username)
router.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username
    if (!identifier || !password) return res.status(400).json({ error: true, code: "VALIDATION_ERROR", message: "identifier and password required" });

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(401).json({ error: true, code: "INVALID_CREDENTIALS", message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: true, code: "INVALID_CREDENTIALS", message: "Invalid credentials" });

    const token = signToken({ id: user._id });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    next(err);
  }
});

// Verify token
router.post("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: true, code: "UNAUTHORIZED", message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = require("../config/jwt").verifyToken(token);
    res.json({ valid: true, payload });
  } catch (err) {
    res.status(401).json({ valid: false, message: err.message });
  }
});

// Protected - get current profile
router.get("/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});

// GET user's books (pagination)
router.get("/profile/books", requireAuth, async (req, res, next) => {
  try {
    let page = parseInt(req.query.page || "1", 10);
    let limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;
    const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const count = await Book.countDocuments({ userId: req.user._id });
    res.json({ page, limit, count, books });
  } catch (err) {
    next(err);
  }
});

// GET user's book stats
router.get("/profile/stats", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const total = await Book.countDocuments({ userId });
    const byGenre = await Book.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$genre", count: { $sum: 1 } } }
    ]);
    const avgYearResult = await Book.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgYear: { $avg: "$year" } } }
    ]);
    res.json({ total, byGenre, avgYear: avgYearResult[0] ? avgYearResult[0].avgYear : null });
  } catch (err) {
    next(err);
  }
});

// Change password
router.put("/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: true, code: "VALIDATION_ERROR", message: "currentPassword and newPassword required" });
    const user = await User.findById(req.user._id);
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(403).json({ error: true, code: "INVALID_CREDENTIALS", message: "Current password incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed" });
  } catch (err) {
    next(err);
  }
});

// Delete account and all user books
router.delete("/delete-account", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Book.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: "Account and books deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
