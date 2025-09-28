js
// src/tests/auth.test.js
const request = require("supertest");
const app = require("../express-server");
const mongoose = require("../config/database");

let token;
let userId;

beforeAll(async () => {
  // Clean up test DB before running auth tests
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API integration tests", () => {
  test("POST /api/v1/auth/register - should create a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        username: "authuser",
        email: "authuser@example.com",
        password: "Password123!",
        firstName: "Auth",
        lastName: "Tester"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "authuser@example.com");
    expect(res.body.user).not.toHaveProperty("password");

    token = res.body.token;
    userId = res.body.user._id;
  });

  test("POST /api/v1/auth/login - should login user with email and password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "authuser@example.com",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("username", "authuser");

    token = res.body.token; // refresh token for next requests
  });

  test("GET /api/v1/auth/profile - should return user profile", async () => {
    const res = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", userId);
    expect(res.body).toHaveProperty("email", "authuser@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  test("PUT /api/v1/auth/profile - should update user profile", async () => {
    const res = await request(app)
      .put("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "UpdatedAuth",
        lastName: "User"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("firstName", "UpdatedAuth");
    expect(res.body).toHaveProperty("lastName", "User");
  });

  test("POST /api/v1/auth/logout - should logout user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Logged out successfully");
  });
});

