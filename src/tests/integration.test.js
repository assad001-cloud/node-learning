const request = require("supertest");
const app = require("../express-server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Book = require("../models/Book");

let userToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await User.deleteMany({});
  await Book.deleteMany({});

  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "flow@example.com", password: "Flow123!" });
  userToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Integration Tests", () => {
  let bookId;

  it("should complete full user workflow", async () => {
    // Create book
    let res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Book A", author: "Me" });
    expect(res.statusCode).toBe(201);
    bookId = res.body._id;

    // Update book
    res = await request(app)
      .put(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Updated Book A" });
    expect(res.statusCode).toBe(200);

    // Delete book
    res = await request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should prevent cross-user actions", async () => {
    const other = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "other@example.com", password: "Other123!" });

    const res = await request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${other.body.token}`);
    expect(res.statusCode).toBe(403);
  });
});
