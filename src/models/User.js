const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true }, // will be hashed later
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

module.exports = mongoose.model("User", userSchema);
