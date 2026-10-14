require("./setup");
const request = require("supertest");
const app = require("../src/app");

const registerUser = async (overrides = {}) => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      ...overrides,
    });

  return { token: res.body.token, user: res.body.user };
};

const createProject = (token, body = { name: "Project One" }) =>
  request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${token}`)
    .send(body);

module.exports = { app, request, registerUser, createProject };
