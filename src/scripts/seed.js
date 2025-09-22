// Seeds initial users and books
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/Book");

async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    console.log("[Seeding] Connecting to:", uri);

    await mongoose.connect(uri);

    // Clear old data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log("[Seeding] Old data cleared.");

    // Add users
    const users = await User.insertMany([
      {
        username: "asad",
        email: "asadafridi@gmail.com",
        password: "asad12345",
        firstName: "Asad",
        lastName: "Nouman",
      },
      {
        username: "taimoor",
        email: "taimoorkhan@gmail.com",
        password: "taimoor12345",
        firstName: "Taimoor",
        lastName: "Khan",
      },
      {
        username: "hussain",
        email: "hussainkhan@gmail.com",
        password: "hussain12345",
        firstName: "Hussain",
        lastName: "Khan",
      },
    ]);

    console.log(`[Seeding] Users added: ${users.length}`);

    // Add sample books (randomly linked to users)
    const sampleBooks = [
      { title: "The Silent Patient", author: "Alex Michaelides", year: 2019, genre: "Thriller" },
      { title: "Atomic Habits", author: "James Clear", year: 2018, genre: "Self-help" },
      { title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
      { title: "The Alchemist", author: "Paulo Coelho", year: 1988, genre: "Fiction" },
      { title: "Sapiens", author: "Yuval Noah Harari", year: 2011, genre: "History" },
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", year: 1997, genre: "Finance" },
      { title: "Clean Code", author: "Robert C. Martin", year: 2008, genre: "Programming" },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999, genre: "Programming" },
      { title: "Deep Work", author: "Cal Newport", year: 2016, genre: "Productivity" },
      { title: "Ikigai", author: "Héctor García", year: 2016, genre: "Self-help" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: 2011, genre: "Psychology" },
      { title: "Man's Search for Meaning", author: "Viktor E. Frankl", year: 1946, genre: "Philosophy" },
    ];

    const books = sampleBooks.map((book) => ({
      ...book,
      userId: users[Math.floor(Math.random() * users.length)]._id,
    }));

    await Book.insertMany(books);
    console.log(`[Seeding] Books added: ${books.length}`);

    console.log("[Seeding] Done.");
    process.exit(0);
  } catch (err) {
    console.error("[Seeding] Error:", err.message);
    process.exit(1);
  }
}

seed();
