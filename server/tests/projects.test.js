const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, request, registerUser, createProject } = require("./helpers");

describe("Projects API", () => {
  let token;

  beforeEach(async () => {
    ({ token } = await registerUser());
  });

  const auth = (req) => req.set("Authorization", `Bearer ${token}`);

  it("creates a project that is active by default", async () => {
    const res = await createProject(token, {
      name: "  Website  ",
      description: "Redesign",
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.name, "Website");
    assert.equal(res.body.data.description, "Redesign");
    assert.equal(res.body.data.isActive, true);
  });

  it("creates an inactive project when isActive is false", async () => {
    const res = await createProject(token, { name: "Archive", isActive: false });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.isActive, false);
  });

  it("rejects a project without a name", async () => {
    const res = await createProject(token, { description: "No name" });
    assert.equal(res.status, 400);
  });

  it("lists the user's projects", async () => {
    await createProject(token, { name: "A" });
    await createProject(token, { name: "B" });

    const res = await auth(request(app).get("/api/projects"));

    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);
  });

  it("updates a project's name and active status", async () => {
    const created = await createProject(token);
    const res = await auth(
      request(app).put(`/api/projects/${created.body.data._id}`),
    ).send({ name: "Renamed", isActive: false });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, "Renamed");
    assert.equal(res.body.data.isActive, false);
  });

  it("deletes a project together with its tasks", async () => {
    const created = await createProject(token);
    const projectId = created.body.data._id;
    await auth(request(app).post(`/api/projects/${projectId}/tasks`)).send({
      title: "Task",
    });

    const res = await auth(request(app).delete(`/api/projects/${projectId}`));
    assert.equal(res.status, 200);

    const tasks = await auth(
      request(app).get(`/api/projects/${projectId}/tasks`),
    );
    assert.equal(tasks.status, 404);
  });

  it("returns a 400 JSON error for a malformed project id", async () => {
    const res = await auth(request(app).get("/api/projects/not-an-id"));

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });
});
