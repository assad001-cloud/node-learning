// Basic database tests
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Book = require("../src/models/Book");

beforeAll(async () => {
  // connect to test db 
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Database tests", () => {
  it("should create a user", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "secret",
      firstName: "Test",
      lastName: "User",
    });
    const saved = await user.save();
    expect(saved.username).toBe("testuser");
  });

  it("should fail on duplicate email", async () => {
    expect.assertions(1);
    try {
      await User.create({
        username: "another",
        email: "test@example.com",
        password: "pass",
        firstName: "Dup",
        lastName: "User",
      });
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it("should create a book linked to a user", async () => {
    const user = await User.findOne({ username: "testuser" });
    const book = await Book.create({
      title: "Test Book",
      author: "Tester",
      year: 2024,
      genre: "Fiction",
      userId: user._id,
    });
    expect(book.userId.toString()).toBe(user._id.toString());
  });
});
