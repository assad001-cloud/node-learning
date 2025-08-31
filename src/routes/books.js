const express = require("express");
const router = express.Router();

let books = [
  { id: 1, title: "Lake of the Ozarks: My Surreal Summers in a Vanishing America", author: "Bill Geist", year: 2019, genre: "Memoir" },
  { id: 2, title: "The Blacklist: The Beekeeper No. 159", author: "Steven Piziks", year: 2017, genre: "Thriller/Crime" },
  { id: 3, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", year: 2005, genre: "Thriller" },
];

// Utility: validate book input
function validateBook(data) {
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!data.title || typeof data.title !== "string" || !data.title.trim())
    errors.push("Title is required and must be a non-empty string.");
  if (!data.author || typeof data.author !== "string" || !data.author.trim())
    errors.push("Author is required and must be a non-empty string.");
  if (typeof data.year !== "number" || data.year < 1000 || data.year > currentYear)
    errors.push(`Year is required and must be a number between 1000 and ${currentYear}.`);
  if (data.genre && typeof data.genre !== "string")
    errors.push("Genre, if provided, must be a string.");

  return errors;
}

// GET all books with optional sort & pagination
router.get("/", (req, res) => {
  let result = [...books];

  // sorting
  const { sort, order } = req.query;
  if (sort && ["title", "author", "year"].includes(sort)) {
    result.sort((a, b) => {
      if (a[sort] < b[sort]) return order === "desc" ? 1 : -1;
      if (a[sort] > b[sort]) return order === "desc" ? -1 : 1;
      return 0;
    });
  }

  // pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedResult = result.slice(start, end);

  res.status(200).json({
    total: result.length,
    page,
    limit,
    books: pagedResult
  });
});

// GET book count
router.get("/count", (req, res) => {
  res.status(200).json({ count: books.length });
});

// search books
router.get("/search", (req, res) => {
  const { title = "", author = "" } = req.query;
  const result = books.filter(
    b =>
      b.title.toLowerCase().includes(title.toLowerCase()) &&
      b.author.toLowerCase().includes(author.toLowerCase())
  );
  res.status(200).json(result);
});

// show a single book by id
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
});

// add a new book
router.post("/", (req, res) => {
  const { title, author, year, genre } = req.body;

  // validation
  const errors = validateBook({ title, author, year, genre });
  if (errors.length) return res.status(400).json({ errors });

  // check duplicate title
  if (books.some(b => b.title.toLowerCase() === title.toLowerCase())) {
    return res.status(400).json({ error: "Book title already exists." });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    year,
    genre: genre || "Unknown",
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// update an existing book
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const { title, author, year, genre } = req.body;
  const errors = validateBook({ title, author, year, genre });
  if (errors.length) return res.status(400).json({ errors });

  // check duplicate title excluding current book
  if (books.some(b => b.title.toLowerCase() === title.toLowerCase() && b.id !== book.id)) {
    return res.status(400).json({ error: "Book title already exists." });
  }

  book.title = title;
  book.author = author;
  book.year = year;
  book.genre = genre || book.genre;

  res.status(200).json(book);
});

// delete a book
router.delete("/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const deleted = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted", book: deleted[0] });
});

module.exports = router;
