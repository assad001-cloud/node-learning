// src/routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const { validateBook } = require("../middleware/validate");
const { requireAuth, optionalAuth, requireOwnership } = require("../middleware/auth");

// GET /api/v1/books - optional auth, supports pagination/sorting/filtering
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { sort = "createdAt", order = "desc", page = 1, limit = 10, genre, title } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const filter = {};
    if (genre) filter.genre = new RegExp(genre, "i");
    if (title) filter.title = new RegExp(title, "i");
    const sortObj = { [sort]: order === "desc" ? -1 : 1 };
    const books = await Book.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit, 10)).populate("userId", "username firstName lastName preferences");
    res.json({ page: Number(page), limit: Number(limit), books });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/books/recent
router.get("/recent", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);
    const books = await Book.find().sort({ createdAt: -1 }).limit(limit).populate("userId", "username");
    res.json({ books });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/books/popular - by views or genre
router.get("/popular", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || "10", 10);
    const books = await Book.find().sort({ views: -1 }).limit(limit).populate("userId", "username");
    res.json({ books });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/books/recommendations - simple genre-based recs for logged-in user
router.get("/recommendations", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const genres = user.preferences.favoriteGenres || [];
    // find popular books within favorite genres
    const books = await Book.find({ genre: { $in: genres } }).sort({ views: -1 }).limit(10);
    res.json({ recommendations: books });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/books - require auth - create book for logged-in user
router.post("/", requireAuth, validateBook, async (req, res, next) => {
  try {
    const { title, author, year, genre } = req.body;
    const book = new Book({ title, author, year: Number(year), genre, userId: req.user._id });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/books/:id - optional auth
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate("userId", "username firstName lastName preferences");
    if (!book) return res.status(404).json({ error: true, message: "Book not found" });
    // Increment views for popularity
    book.views = (book.views || 0) + 1;
    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/books/:id - require auth + ownership
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: true, message: "Book not found" });
    // ownership check
    if (req.user.role !== "admin" && book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Not owner" });
    }
    const { title, author, year, genre } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = Number(year);
    if (genre) book.genre = genre;
    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/books/:id - require auth + ownership
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: true, message: "Book not found" });
    if (req.user.role !== "admin" && book.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: true, code: "FORBIDDEN", message: "Not owner" });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
