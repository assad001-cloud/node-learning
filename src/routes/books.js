// src/routes/books.js
const express = require("express");
const Book = require("../models/Book");
const { requireAuth, optionalAuth, requireOwnership } = require("../middleware/auth");
const { bookValidators } = require("../middleware/validation");
const router = express.Router();

// GET /api/v1/books - optional auth, show ownership flag if logged in
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const books = await Book.find().populate("userId", "username firstName lastName");
    const enriched = books.map(b => {
      const obj = b.toObject();
      obj.isOwner = req.user ? obj.userId && obj.userId._id && obj.userId._id.toString() === req.user._id.toString() : false;
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/books - require auth
router.post("/", requireAuth, bookValidators, async (req, res, next) => {
  try {
    const { title, author, year, genre, isbn } = req.body;
    const book = new Book({
      title, author, year, genre, isbn, userId: req.user._id
    });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/books/:id - require auth + ownership
router.put("/:id", requireAuth, requireOwnership(Book, "userId"), bookValidators, async (req, res, next) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/books/:id - require auth + ownership
router.delete("/:id", requireAuth, requireOwnership(Book, "userId"), async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
