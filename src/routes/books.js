const express = require("express");
const router = express.Router();

// starting books data
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


// function to check book input
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


// get all books with sorting and pagination
router.get("/", (req, res) => {
  let result = [...books];

  // sort books if requested
  const { sort, order, page, limit } = req.query;
  if (sort) {
    result.sort((a, b) => {
      if (a[sort] < b[sort]) return order === "desc" ? 1 : -1;
      if (a[sort] > b[sort]) return order === "desc" ? -1 : 1;
      return 0;
    });
  }


  // pagination if page and limit are given
  if (page && limit) {
    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    result = result.slice(start, end);
  }

  res.status(200).json(result);
});


// search books by title and/or author
router.get("/search", (req, res) => {
  const { title, author } = req.query;
  let result = [...books];

  if (title) {
    result = result.filter((b) =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  if (author) {
    result = result.filter((b) =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  res.status(200).json(result);
});



// get one book by id
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.status(200).json(book);
});



// create a new book
router.post("/", (req, res) => {
  const errors = validateBook(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }



  // check duplicate title
  if (books.some((b) => b.title.toLowerCase() === req.body.title.toLowerCase())) {
    return res.status(400).json({ error: "Book with this title already exists" });
  }

  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    ...req.body,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});



// update book
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const errors = validateBook(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  book.title = req.body.title;
  book.author = req.body.author;
  book.year = req.body.year;
  book.genre = req.body.genre || book.genre;

  res.status(200).json(book);
});



// delete book
router.delete("/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const deletedBook = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted", book: deletedBook[0] });
});


// count books
router.get("/count/all", (req, res) => {
  res.status(200).json({ count: books.length });
});

module.exports = router;
