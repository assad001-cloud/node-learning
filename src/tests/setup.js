// src/tests/setup.js
const mongoose = require("mongoose");

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST;

  if (!mongoUri) {
    throw new Error("MONGO_URI_TEST is not defined in environment variables");
  }

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase(); // Clean up test DB
    await mongoose.connection.close();
  }
});
