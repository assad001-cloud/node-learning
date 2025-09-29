const request = require("supertest");
const app = require("../express-server");
const mongoose = require("mongoose");
const User = require("../models/User");

let userToken, adminToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await User.deleteMany({});

  const user = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "user@example.com", password: "User123!" });

  const admin = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "admin@example.com", password: "Admin123!", role: "admin" });

  userToken = user.body.token;
  adminToken = admin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authorization Tests", () => {
  it("should deny access to protected route without token", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toBe(401);
  });

  it("should allow access with valid user token", async () => {
    const res = await request(app)
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("should restrict admin-only route for normal user", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it("should allow admin-only route for admin", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
