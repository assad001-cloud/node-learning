const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// GET all users (paginated)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", id: newUser._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
