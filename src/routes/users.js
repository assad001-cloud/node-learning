const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validateUser } = require("../middleware/validate");

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) { next(err); }
});

// POST create user
router.post("/", validateUser, async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = new User({ username, email, password, firstName, lastName });
    const saved = await user.save();
    res.status(201).json({ ...saved.toObject(), password: undefined });
  } catch (err) { next(err); }
});

module.exports = router;
