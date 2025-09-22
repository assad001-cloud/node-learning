require("dotenv").config();
const mongoose = require("mongoose");

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // drop test db after all tests
  await mongoose.connection.close();
});

beforeEach(async () => {
  // clear all collections before each test
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
});
