const request = require("supertest");
const app = require("../express-server");
const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication Tests", () => {
  const userData = { email: "test@example.com", password: "Password123!" };

  it("should register a user with valid data", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register a user with invalid data", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "bad", password: "123" });
    expect(res.statusCode).toBe(400);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });

  it("should reject expired or invalid JWT", async () => {
    const res = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
  });
});
