const express = require("express");
const Book = require("../models/Book");
const { requireAuth, optionalAuth, requireOwnership } = require("../middleware/auth");

const router = express.Router();

// GET all books (optional auth)
router.get("/", optionalAuth, async (req, res) => {
  const books = await Book.find();
  res.json({
    books,
    user: req.user ? req.user.username : null
  });
});

// GET single book (optional auth)
router.get("/:id", optionalAuth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// CREATE book (require auth)
router.post("/", requireAuth, async (req, res) => {
  const book = await Book.create({ ...req.body, user: req.user._id });
  res.status(201).json(book);
});

// UPDATE book (require auth + ownership)
router.put("/:id", requireAuth, requireOwnership(Book), async (req, res) => {
  const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE book (require auth + ownership)
router.delete("/:id", requireAuth, requireOwnership(Book), async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

module.exports = router;
