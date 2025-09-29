// src/scripts/migrate.js
// Ensures MongoDB collections & indexes are created for models

require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");
const User = require("../models/User");
const Book = require("../models/Book");

const targetArg = process.argv[2];
const uri = targetArg === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

if (!uri) {
  console.error("No MONGO_URI provided. Aborting migration.");
  process.exit(1);
}

(async () => {
  try {
    logger.info("[Migrate] Connecting to DB...", { uriPreview: uri.slice(0, 60) + "..." });
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Initialize collections & indexes
    await User.init();
    await Book.init();

    logger.info("[Migrate] Migration complete: collections & indexes ready.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error("[Migrate] Error during migration", { message: err.message, stack: err.stack });
    process.exit(1);
  }
})();
