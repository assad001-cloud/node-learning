// src/scripts/drop.js
// Drops the target MongoDB database (dev or test)

require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const targetArg = process.argv[2];
const uri = targetArg === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

if (!uri) {
  console.error("No MONGO_URI provided. Aborting drop.");
  process.exit(1);
}

(async () => {
  try {
    logger.info("[Drop] Connecting to DB...", { uriPreview: uri.slice(0, 60) + "..." });
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.dropDatabase();
    logger.info("[Drop] Database dropped successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    logger.error("[Drop] Error during drop", { message: err.message, stack: err.stack });
    process.exit(1);
  }
})();
