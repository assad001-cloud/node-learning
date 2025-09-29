const request = require("supertest");
const app = require("../express-server");
const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await User.deleteMany({});
  await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "secure@example.com", password: "Secure123!" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Security Tests", () => {
  it("should block NoSQL injection attempts", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: { $gt: "" }, password: "hack" });
    expect(res.statusCode).toBe(400);
  });

  it("should sanitize input to prevent XSS", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "<script>alert(1)</script>", password: "Test123!" });
    expect(res.statusCode).toBe(400);
  });

  it("should block CSRF (same-origin enforced)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Origin", "http://evil.com")
      .send({ email: "secure@example.com", password: "Secure123!" });
    expect(res.statusCode).toBe(403);
  });
});
