// Creates the collections if they don't exist
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/Book");

async function migrate() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("[Migrate] Connecting to:", uri);

    await mongoose.connect(uri);

    // Ensure collections & indexes are created
    await User.init();
    await Book.init();

    console.log("[Migrate] Migration complete: collections & indexes are ready.");
    process.exit(0);
  } catch (err) {
    console.error("[Migrate] Error:", err.message);
    process.exit(1);
  }
}

migrate();
