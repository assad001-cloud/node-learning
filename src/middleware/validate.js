const currentYear = new Date().getFullYear();

// Validate Book payload
function validateBook(req, res, next) {
  const { title, author, year, genre, userId } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") errors.push("Title must be a non-empty string");
  if (!author || typeof author !== "string" || author.trim() === "") errors.push("Author must be a non-empty string");
  if (year === undefined || typeof year !== "number" || year < 1000 || year > currentYear) errors.push(`Year must be a number between 1000 and ${currentYear}`);
  if (genre && typeof genre !== "string") errors.push("Genre must be a string if provided");
  if (!userId) errors.push("userId is required to associate book with a user");

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
}

// Validate User payload
function validateUser(req, res, next) {
  const { username, email, password, firstName, lastName } = req.body;
  const errors = [];

  if (!username || typeof username !== "string" || username.trim() === "") errors.push("username is required");
  if (!email || typeof email !== "string" || email.trim() === "") errors.push("email is required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email must be valid");
  if (!password || typeof password !== "string" || password.length < 6) errors.push("password must be at least 6 characters");
  if (!firstName || typeof firstName !== "string") errors.push("firstName is required");
  if (!lastName || typeof lastName !== "string") errors.push("lastName is required");

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
}

module.exports = { validateBook, validateUser };
