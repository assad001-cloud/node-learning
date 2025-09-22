// API endpoint tests using supertest
require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/express-server"); 

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API tests", () => {
  it("should return users list", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a book", async () => {
    const userRes = await request(app).get("/users");
    const user = userRes.body[0];

    const res = await request(app).post("/books").send({
      title: "API Book",
      author: "API Tester",
      year: 2025,
      genre: "Testing",
      userId: user._id,
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("API Book");
  });

  it("should handle invalid book creation", async () => {
    const res = await request(app).post("/books").send({});
    expect(res.status).toBe(400);
  });
});
