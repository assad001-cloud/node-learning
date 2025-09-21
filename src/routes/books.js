// src/routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");

// Validate book input
function validateBook(data) {
  const { title, author, year, genre } = data;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Title must be a non-empty string");
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    errors.push("Author must be a non-empty string");
  }

  const currentYear = new Date().getFullYear();
  if (!year || typeof year !== "number" || year < 1000 || year > currentYear) {
    errors.push(`Year must be a number between 1000 and ${currentYear}`);
  }

  if (genre && typeof genre !== "string") {
    errors.push("Genre must be a string if provided");
  }

  return errors;
}

// -------------------- Routes -------------------- //

// Get all books with optional sorting and pagination
router.get("/", async (req, res) => {
  try {
    let { sort, order, page, limit } = req.query;
    let query = Book.find();

    // Sorting
    if (sort) {
      const sortOrder = order === "desc" ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }

    // Pagination
    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const books = await query.populate("userId", "username email");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search books by title and/or author
router.get("/search", async (req, res) => {
  try {
    const { title, author } = req.query;
    let filter = {};

    if (title) filter.title = new RegExp(title, "i");
    if (author) filter.author = new RegExp(author, "i");

    const books = await Book.find(filter).populate("userId", "username email");
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("userId", "username email");
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new book
router.post("/", async (req, res) => {
  try {
    const errors = validateBook(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    // For now, associate with a default user (replace with actual logged-in user later)
    let defaultUser = await User.findOne();
    if (!defaultUser) {
      defaultUser = await User.create({
        username: "asad",
        email: "asadnouman@gmail.com",
        password: "Asad123", // should be hashed in real-world
        firstName: "Asad",
        lastName: "Nouman",
      });
    }

    // Check duplicate title
    const exists = await Book.findOne({ title: req.body.title });
    if (exists) return res.status(400).json({ error: "Book with this title already exists" });

    const newBook = new Book({
      ...req.body,
      userId: defaultUser._id,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book by ID
router.put("/:id", async (req, res) => {
  try {
    const errors = validateBook(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted", book: deletedBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total count of books
router.get("/count/all", async (req, res) => {
  try {
    const count = await Book.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
