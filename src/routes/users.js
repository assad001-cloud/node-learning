// src/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const { requireAuth, requireAdmin, optionalAuth } = require("../middleware/auth");

// GET all users (admin only) - paginated
router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const users = await User.find().select("-password").skip(skip).limit(limit);
    const count = await User.countDocuments();
    res.json({ page, limit, count, users });
  } catch (err) {
    next(err);
  }
});

// Public profile by username (respect privacy)
router.get("/:username/profile", optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ error: true, code: "NOT_FOUND", message: "User not found" });
    if (user.preferences.privacy.profileVisibility === "private") {
      // if private and requester is not owner or admin, hide details
      if (!req.user || (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin")) {
        return res.status(403).json({ error: true, code: "PRIVATE_PROFILE", message: "Profile is private" });
      }
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Get public books of a username
router.get("/:username/books", optionalAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: true, message: "User not found" });
    if (user.preferences.privacy.profileVisibility === "private" && (!req.user || req.user._id.toString() !== user._id.toString()) && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ error: true, message: "Profile private" });
    }
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;
    const books = await Book.find({ userId: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const count = await Book.countDocuments({ userId: user._id });
    res.json({ page, limit, count, books });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
