// src/tests/api.test.js
const request = require("supertest");
const app = require("../express-server");

let userId;

beforeAll(async () => {
  // Create a user to attach books
  const userRes = await request(app).post("/api/v1/users").send({
    username: "bookuser",
    email: "bookuser@example.com",
    password: "password123",
    firstName: "Book",
    lastName: "User"
  });

  userId = userRes.body._id;
});

describe("API integration tests", () => {
  test("POST /api/v1/books requires validation and can create", async () => {
    const res = await request(app).post("/api/v1/books").send({
      title: "API Integration Book",
      author: "Tester",
      year: 2025,
      genre: "Test",
      userId
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("API Integration Book");

    // Ensure userId returned is a string
    expect(String(res.body.userId)).toBe(String(userId));
  });
});
