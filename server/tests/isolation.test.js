const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, request, registerUser, createProject } = require("./helpers");

describe("Ownership isolation", () => {
  let owner;
  let other;
  let projectId;
  let taskId;

  beforeEach(async () => {
    owner = (await registerUser()).token;
    other = (await registerUser({ email: "other@example.com" })).token;

    projectId = (await createProject(owner)).body.data._id;
    taskId = (
      await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${owner}`)
        .send({ title: "Private task" })
    ).body.data._id;
  });

  const asOther = (req) => req.set("Authorization", `Bearer ${other}`);

  it("hides other users' projects from the list", async () => {
    const res = await asOther(request(app).get("/api/projects"));
    assert.equal(res.body.count, 0);
  });

  const cases = [
    ["get", "project", () => `/api/projects/${projectId}`],
    ["put", "project", () => `/api/projects/${projectId}`],
    ["delete", "project", () => `/api/projects/${projectId}`],
    ["get", "project tasks", () => `/api/projects/${projectId}/tasks`],
    ["post", "project tasks", () => `/api/projects/${projectId}/tasks`],
    ["put", "task", () => `/api/tasks/${taskId}`],
    ["delete", "task", () => `/api/tasks/${taskId}`],
  ];

  for (const [method, target, path] of cases) {
    it(`returns 404 for ${method} on another user's ${target}`, async () => {
      const res = await asOther(request(app)[method](path())).send({
        name: "Hacked",
        title: "Hacked",
      });

      assert.equal(res.status, 404);
    });
  }
});
