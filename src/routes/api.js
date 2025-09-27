const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const booksRouter = require("./books");

router.use("/users", usersRouter);
router.use("/books", booksRouter);

module.exports = router;
