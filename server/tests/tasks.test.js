const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, request, registerUser, createProject } = require("./helpers");

describe("Tasks API", () => {
  let token;
  let projectId;

  beforeEach(async () => {
    ({ token } = await registerUser());
    projectId = (await createProject(token)).body.data._id;
  });

  const auth = (req) => req.set("Authorization", `Bearer ${token}`);
  const createTask = (body) =>
    auth(request(app).post(`/api/projects/${projectId}/tasks`)).send(body);

  it("creates a task with default status and priority", async () => {
    const res = await createTask({ title: "Write docs", dueDate: "2030-01-15" });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.title, "Write docs");
    assert.equal(res.body.data.status, "todo");
    assert.equal(res.body.data.priority, "medium");
    assert.match(res.body.data.dueDate, /^2030-01-15/);
  });

  it("rejects an invalid status", async () => {
    const res = await createTask({ title: "Bad", status: "unknown" });
    assert.equal(res.status, 400);
  });

  it("filters tasks by status", async () => {
    await createTask({ title: "One" });
    await createTask({ title: "Two", status: "in-progress" });
    await createTask({ title: "Three", status: "completed" });

    const res = await auth(
      request(app).get(`/api/projects/${projectId}/tasks?status=in-progress`),
    );

    assert.equal(res.status, 200);
    assert.equal(res.body.count, 1);
    assert.equal(res.body.data[0].title, "Two");
  });

  it("updates a task's status and fields", async () => {
    const created = await createTask({ title: "Old" });
    const res = await auth(
      request(app).put(`/api/tasks/${created.body.data._id}`),
    ).send({ title: "New", status: "completed", priority: "high" });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.title, "New");
    assert.equal(res.body.data.status, "completed");
    assert.equal(res.body.data.priority, "high");
  });

  it("deletes a task", async () => {
    const created = await createTask({ title: "Remove me" });
    const res = await auth(
      request(app).delete(`/api/tasks/${created.body.data._id}`),
    );

    assert.equal(res.status, 200);

    const list = await auth(request(app).get(`/api/projects/${projectId}/tasks`));
    assert.equal(list.body.count, 0);
  });
});
