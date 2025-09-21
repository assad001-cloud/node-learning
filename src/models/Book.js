const mongoose = require("mongoose");

// Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String },
    isbn: { type: String, unique: true, sparse: true }, // optional unique
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // relation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
