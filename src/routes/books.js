const express = require("express");
const router = express.Router();

// sample books stored in memory
let books = [
  {
    id: 1,
    title: "White Boy Rick: My Time As an Undercover Teenage Drug Informant for the FBI",
    author: "Richard Wershe Jr. & Scott Burnstein",
    year: 2018,
    genre: "Non-fiction / True Crime",
  },
  {
    id: 2,
    title: "Blacklist",
    author: "Sara Paretsky",
    year: 2003,
    genre: "Crime / Mystery",
  },
  {
    id: 3,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    year: 2005,
    genre: "Crime / Mystery / Thriller",
  },
];


// get all books
router.get("/books", (req, res) => {
  res.status(200).json(books);
});


// get a single book by id
router.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.status(200).json(book);
});



// add a new book
router.post("/books", (req, res) => {
  const { title, author, year, genre } = req.body;

  // check required fields
  if (!title || !author || !year) {
    return res.status(400).json({ error: "Title, author, and year are required" });
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


// update a book by id
router.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author, year, genre } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: "Title, author, and year are required" });
  }


  // update book details
  book.title = title;
  book.author = author;
  book.year = year;
  book.genre = genre || book.genre;

  res.status(200).json(book);
});


// delete a book by id
router.delete("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.status(200).json({ message: "Book deleted", book: deletedBook[0] });
});


module.exports = router;
