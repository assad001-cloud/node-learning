// src/config/database.js
require("dotenv").config(); // load .env first
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

if (!dbURI) {
  logger.error("MongoDB URI is not defined in .env file!");
  throw new Error("MongoDB URI is not defined");
}

mongoose
  .connect(dbURI)
  .then(() => logger.info(`MongoDB connected: ${dbURI}`))
  .catch((err) => logger.error("MongoDB connection error", { message: err.message }));

module.exports = mongoose;
