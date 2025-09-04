const express = require("express");
const router = express.Router();
const validateBook = require("../middleware/validateBook");

// Show all books with optional sorting & pagination
router.get("/", (req, res) => {
  let { sort, order = "asc", page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let result = [...global.books];

  // Sorting
  if (sort && ["title","author","year"].includes(sort)) {
    result.sort((a,b) => {
      if(a[sort] < b[sort]) return order === "asc" ? -1 : 1;
      if(a[sort] > b[sort]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const total = result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedBooks = result.slice(start, end);

  res.status(200).json({ total, page, limit, books: paginatedBooks });
});

// Book count
router.get("/count", (req, res) => {
  res.status(200).json({ total: global.books.length });
});

// Get single book
router.get("/:id", (req, res) => {
  const book = global.books.find(b => b.id === parseInt(req.params.id));
  if(!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
});

// Search books
router.get("/search", (req, res) => {
  const { title, author } = req.query;
  let result = [...global.books];
  if(title) result = result.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  if(author) result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  res.status(200).json(result);
});

// Add new book
router.post("/", validateBook, (req, res) => {
  const { title, author, year, genre } = req.body;

  // Check duplicate title
  const exists = global.books.find(b => b.title.toLowerCase() === title.toLowerCase());
  if(exists) return res.status(400).json({ error: "Book title already exists" });

  const newBook = {
    id: global.books.length ? global.books[global.books.length - 1].id + 1 : 1,
    title,
    author,
    year,
    genre: genre || "Unknown"
  };

  global.books.push(newBook);
  res.status(201).json(newBook);
});

// Update book
router.put("/:id", validateBook, (req, res) => {
  const book = global.books.find(b => b.id === parseInt(req.params.id));
  if(!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, year, genre } = req.body;

  // Check duplicate title (ignore same book)
  const exists = global.books.find(b => b.title.toLowerCase() === title.toLowerCase() && b.id !== book.id);
  if(exists) return res.status(400).json({ error: "Book title already exists" });

  book.title = title;
  book.author = author;
  book.year = year;
  book.genre = genre || book.genre;

  res.status(200).json(book);
});

// Delete book
router.delete("/:id", (req, res) => {
  const index = global.books.findIndex(b => b.id === parseInt(req.params.id));
  if(index === -1) return res.status(404).json({ error: "Book not found" });

  const deleted = global.books.splice(index, 1);
  res.status(200).json({ message: "Book deleted", book: deleted[0] });
});

module.exports = router;
