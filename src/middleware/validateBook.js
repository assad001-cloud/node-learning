module.exports = function validateBook(req, res, next) {
  const { title, author, year, genre } = req.body;
  const currentYear = new Date().getFullYear();
  let errors = [];

  if (!title || typeof title !== "string") errors.push("Title is required and must be string");
  if (!author || typeof author !== "string") errors.push("Author is required and must be string");
  if (!year || typeof year !== "number" || year < 1000 || year > currentYear) errors.push("Year must be a number between 1000 and current year");
  if (genre && typeof genre !== "string") errors.push("Genre must be a string if provided");

  if (errors.length) return res.status(400).json({ errors });
  next();
};
