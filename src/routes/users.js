const express = require("express");
const User = require("../models/User");
const { requireAuth, optionalAuth, requireOwnership, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET all users (admin only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET user by id (optional auth)
router.get("/:id", optionalAuth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// UPDATE user (require ownership)
router.put("/:id", requireAuth, requireOwnership(User), async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
  res.json(updated);
});

// DELETE user (require ownership)
router.delete("/:id", requireAuth, requireOwnership(User), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
