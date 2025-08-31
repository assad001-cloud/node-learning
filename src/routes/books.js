const express = require("express");
const router = express.Router();

// temporary list of books (acts like a small DB)
let books = [
  {
    id: 1,
    title: "Lake of the Ozarks: My Surreal Summers in a Vanishing America",
    author: "Bill Geist",
    year: 2019,
    genre: "Memoir",
  },
  {
    id: 2,
    title: "The Blacklist: The Beekeeper No. 159",
    author: "Steven Piziks",
    year: 2017,
    genre: "Thriller/Crime",
  },
  {
    id: 3,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    year: 2005,
    genre: "Thriller",
  },
];

// show all books
router.get("/", (req, res) => {
  res.status(200).json(books);
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
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ error: "Title, author, and year are required" });
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
  if (!title || !author || !year) {
    return res
      .status(400)
      .json({ error: "Title, author, and year are required" });
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
