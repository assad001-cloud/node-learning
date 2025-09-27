const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { validateBook } = require("../middleware/validate");

// GET all books
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find();
    // Return userId as string
    const formatted = books.map(b => ({ ...b.toObject(), userId: b.userId.toString() }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// POST create new book
router.post("/", validateBook, async (req, res, next) => {
  try {
    const { title, author, year, genre, userId } = req.body;
    if (!userId) return res.status(400).json({ errors: ["userId is required"] });

    const book = new Book({ title, author, year: Number(year), genre, userId });
    const saved = await book.save();

    res.status(201).json({ ...saved.toObject(), userId: saved.userId.toString() });
  } catch (err) {
    next(err);
  }
});

// GET book by ID
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json({ ...book.toObject(), userId: book.userId.toString() });
  } catch (err) {
    next(err);
  }
});

// PUT update book
router.put("/:id", validateBook, async (req, res, next) => {
  try {
    const { title, author, year, genre, userId } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, year: Number(year), genre, userId },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json({ ...book.toObject(), userId: book.userId.toString() });
  } catch (err) {
    next(err);
  }
});

// DELETE book
router.delete("/:id", async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
