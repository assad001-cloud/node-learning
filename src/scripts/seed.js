// src/scripts/seed.js
// Seeds sample users and books from books-data.json
// Usage: node src/scripts/seed.js         -> seeds MONGO_URI (dev)
//        node src/scripts/seed.js test    -> seeds MONGO_URI_TEST (test)

require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const User = require("../models/User");
const Book = require("../models/Book");
const fs = require("fs");

const targetArg = process.argv[2];
const uri = targetArg === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

if (!uri) {
  console.error("No MONGO_URI provided. Aborting seeding.");
  process.exit(1);
}

(async () => {
  try {
    logger.info("[Seed] Connecting to DB...", { uriPreview: uri.slice(0, 60) + "..." });
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    logger.info("[Seed] Cleared existing data.");

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

    // Sample users
    const usersToInsert = [
      { username: "asad", email: "asad@example.com", password: "asad12345", firstName: "Asad", lastName: "Nouman" },
      { username: "taimoor", email: "taimoor@example.com", password: "taimoor12345", firstName: "Taimoor", lastName: "Khan" },
      { username: "hussain", email: "hussain@example.com", password: "hussain12345", firstName: "Hussain", lastName: "Khan" },
      { username: "defaultuser", email: "default@example.com", password: "Default123!", firstName: "Default", lastName: "User" }
    ];

    // Hash passwords
    for (const u of usersToInsert) {
      u.password = await bcrypt.hash(u.password, saltRounds);
    }

    const users = await User.insertMany(usersToInsert);
    logger.info("[Seed] Inserted users", { count: users.length });

    // Load books from JSON
    const booksJsonPath = path.join(__dirname, "books-data.json");
    const booksData = JSON.parse(fs.readFileSync(booksJsonPath, "utf-8"));

    // Assign random users to books
    const booksToInsert = booksData.map(b => {
      const assignedUser = users[Math.floor(Math.random() * users.length)];
      return {
        title: b.title,
        author: b.author,
        year: b.year,
        genre: b.genre,
        userId: assignedUser._id,
      };
    });

    const books = await Book.insertMany(booksToInsert);
    logger.info("[Seed] Inserted books", { count: books.length });

    await mongoose.connection.close();
    logger.info("[Seed] Seeding complete.");
    process.exit(0);
  } catch (err) {
    logger.error("[Seed] Error during seeding", { message: err.message, stack: err.stack });
    process.exit(1);
  }
})();
