const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { app, request } = require("./helpers");
const { seed, DEMO_EMAIL, DEMO_PASSWORD } = require("../src/seeders/seed");
const Project = require("../src/models/Project");
const Task = require("../src/models/Task");

describe("Seeder", () => {
  it("creates a demo user that can log in and see the sample data", async () => {
    const { projectCount, taskCount } = await seed();

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.equal(login.status, 200);

    const projects = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${login.body.token}`);
    assert.equal(projects.body.count, projectCount);
    assert.ok(projects.body.data.some((project) => !project.isActive));
    assert.ok(taskCount > 0);
  });

  it("can be run repeatedly without duplicating data", async () => {
    await seed();
    const { projectCount, taskCount } = await seed();

    assert.equal(await Project.countDocuments(), projectCount);
    assert.equal(await Task.countDocuments(), taskCount);
  });
});
