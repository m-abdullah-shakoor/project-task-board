const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { app, request, registerUser } = require("./helpers");
const User = require("../src/models/User");

describe("Auth API", () => {
  it("registers a user, hashes the password and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane",
      email: "Jane@Example.com",
      password: "password123",
    });

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.name, "Jane");
    assert.equal(res.body.user.email, "jane@example.com");

    const saved = await User.findOne({ email: "jane@example.com" }).select(
      "+password",
    );
    assert.notEqual(saved.password, "password123");
  });

  it("rejects a duplicate email", async () => {
    await registerUser();
    const res = await request(app).post("/api/auth/register").send({
      name: "Again",
      email: "test@example.com",
      password: "password123",
    });

    assert.equal(res.status, 409);
  });

  it("rejects a short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Short",
      email: "short@example.com",
      password: "123",
    });

    assert.equal(res.status, 400);
  });

  it("logs in with correct credentials", async () => {
    await registerUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  it("rejects a wrong password", async () => {
    await registerUser();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrong-password" });

    assert.equal(res.status, 401);
  });

  it("returns the current user for a valid token", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, "test@example.com");
  });

  it("blocks private routes without a token", async () => {
    const res = await request(app).get("/api/projects");
    assert.equal(res.status, 401);
  });

  it("blocks private routes with an invalid token", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", "Bearer not-a-real-token");

    assert.equal(res.status, 401);
  });
});
