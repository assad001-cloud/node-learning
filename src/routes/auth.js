// src/routes/auth.js
// Authentication routes: register, login, logout, profile GET/PUT

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signToken, blacklistToken } = require("../config/jwt");
const { requireAuth } = require("../middleware/auth");

// Helper to return consistent error response for validation results
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, errors: errors.array().map(e => e.msg) });
  }
  return null;
}

// POST /api/v1/auth/register
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("username must be 3+ chars").trim().escape(),
    body("email").isEmail().withMessage("invalid email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("password must be 8+ chars"),
    body("firstName").isLength({ min: 1 }).withMessage("firstName required").trim().escape(),
    body("lastName").isLength({ min: 1 }).withMessage("lastName required").trim().escape(),
  ],
  async (req, res, next) => {
    try {
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      const { username, email, password, firstName, lastName } = req.body;

      // Check duplicates
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(409).json({ error: true, message: "username or email already exists" });

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashed, firstName, lastName });
      await newUser.save();

      // Sign token
      const token = signToken({ id: newUser._id, role: newUser.role });

      // Set httpOnly cookie
      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 3600 * 1000 });

      // Return user without password
      const userToReturn = newUser.toObject();
      delete userToReturn.password;

      return res.status(201).json({ token, user: userToReturn });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/login
router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("email or username required"),
    body("password").notEmpty().withMessage("password required"),
  ],
  async (req, res, next) => {
    try {
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      // identifier can be email or username
      const { identifier, password } = req.body;
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) return res.status(401).json({ error: true, message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: true, message: "Invalid credentials" });

      const token = signToken({ id: user._id, role: user.role });
      res.cookie("token", token, { httpOnly: true, maxAge: 24 * 3600 * 1000 });

      const userToReturn = user.toObject();
      delete userToReturn.password;

      return res.status(200).json({ token, user: userToReturn });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/logout
router.post("/logout", requireAuth, (req, res) => {
  try {
    const token = req.token || (req.cookies && req.cookies.token);
    if (token) {
      blacklistToken(token);
      res.clearCookie("token");
    }
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Logout failed" });
  }
});

// GET /api/v1/auth/profile
router.get("/profile", requireAuth, async (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  res.json({ user });
});

// PUT /api/v1/auth/profile
router.put(
  "/profile",
  requireAuth,
  [
    body("firstName").optional().isLength({ min: 1 }).trim().escape(),
    body("lastName").optional().isLength({ min: 1 }).trim().escape(),
    body("email").optional().isEmail().normalizeEmail(),
    body("currentPassword").optional().isString(),
    body("newPassword").optional().isLength({ min: 8 }).withMessage("newPassword must be 8+ chars"),
  ],
  async (req, res, next) => {
    try {
      const validationError = handleValidationErrors(req, res);
      if (validationError) return;

      const user = req.user;
      const { firstName, lastName, email, currentPassword, newPassword } = req.body;

      // If changing sensitive info (email or password) require currentPassword
      if ((email || newPassword) && !currentPassword) {
        return res.status(400).json({ error: true, message: "Current password required to change email/password" });
      }

      if (currentPassword) {
        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) return res.status(401).json({ error: true, message: "Current password incorrect" });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

      await user.save();
      const userToReturn = user.toObject();
      delete userToReturn.password;

      res.json({ user: userToReturn });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
