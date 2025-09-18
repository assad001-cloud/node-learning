module.exports = function validateBook(req, res, next) {
  const { title, author, year, genre } = req.body;
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

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
