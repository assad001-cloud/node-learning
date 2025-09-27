// src/tests/database.test.js
const mongoose = require("../config/database");

beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once("open", resolve);
      mongoose.connection.once("error", reject);
    });
  }
});

test("MongoDB connection", async () => {
  expect(mongoose.connection.readyState).toBe(1); // 1 = connected
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});
