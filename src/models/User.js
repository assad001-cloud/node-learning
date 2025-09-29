// src/middleware/validate.js
const currentYear = new Date().getFullYear();

function validateBook(req, res, next) {
  const { title, author, year, genre } = req.body;
  const errors = [];
  if (!title || typeof title !== "string" || title.trim() === "") errors.push("Title required");
  if (!author || typeof author !== "string" || author.trim() === "") errors.push("Author required");
  if (year === undefined || typeof year !== "number" || year < 1000 || year > currentYear + 1) errors.push(`Year must be 1000..${currentYear + 1}`);
  if (genre && typeof genre !== "string") errors.push("Genre must be string");
  if (errors.length) return res.status(400).json({ error: true, code: "VALIDATION_ERROR", details: errors });
  next();
}

function validateUserRegistration(req, res, next) {
  const { username, email, password, firstName, lastName } = req.body;
  const errors = [];
  if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) errors.push("username must be 3-20 chars, alphanumeric/underscore");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("valid email required");
  if (!password || password.length < 8) errors.push("password must be at least 8 chars");
  if (!firstName || firstName.length < 2) errors.push("firstName required");
  if (!lastName || lastName.length < 2) errors.push("lastName required");
  if (errors.length) return res.status(400).json({ error: true, code: "VALIDATION_ERROR", details: errors });
  next();
}

module.exports = { validateBook, validateUserRegistration };
