import { useEffect, useState } from "react";
import {
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProjects,
  getTasks,
  updateTask,
} from "../services/api";

const columns = [
  { id: "todo", label: "To Do", color: "bg-slate-500" },
  { id: "in-progress", label: "In Progress", color: "bg-indigo-500" },
  { id: "completed", label: "Completed", color: "bg-emerald-500" },
];

const priorityColors = {
  low: "text-slate-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

export default function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadProjects() {
    const result = await getProjects();
    const items = result.data || [];

    setProjects(items);
    setActiveProject((current) =>
      items.some((project) => project._id === current)
        ? current
        : items[0]?._id || "",
    );

    return items;
  }

  async function loadTasks(projectId) {
    if (!projectId) {
      setTasks([]);
      return;
    }

    const result = await getTasks(projectId);
    setTasks(result.data || []);
  }

  useEffect(() => {
    async function initialize() {
      try {
        await loadProjects();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      try {
        await loadTasks(activeProject, () => cancelled);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [activeProject]);

  async function handleCreateProject(event) {
    event.preventDefault();
    if (!projectName.trim()) return;

    setBusy(true);
    setError("");

    try {
      const result = await createProject({ name: projectName.trim() });
      const project = result.data;

      setProjects((current) => [project, ...current]);
      setActiveProject(project._id);
      setProjectName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!activeProject || !taskTitle.trim()) return;

    setBusy(true);
    setError("");

    try {
      const result = await createTask(activeProject, {
        title: taskTitle.trim(),
        priority: taskPriority,
      });

      setTasks((current) => [result.data, ...current]);
      setTaskTitle("");
      setTaskPriority("medium");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(task, status) {
    setError("");

    try {
      const result = await updateTask(task._id, { status });
      setTasks((current) =>
        current.map((item) => (item._id === task._id ? result.data : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProject() {
    const project = projects.find((item) => item._id === activeProject);
    if (
      !project ||
      !window.confirm(`Delete "${project.name}" and its tasks?`)
    ) {
      return;
    }

    try {
      await deleteProject(project._id);
      const remaining = projects.filter((item) => item._id !== project._id);
      setProjects(remaining);
      setActiveProject(remaining[0]?._id || "");
      setTasks([]);
    } catch (err) {
      setError(err.message);
    }
  }

  const activeProjectName =
    projects.find((project) => project._id === activeProject)?.name ||
    "Select a project";

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">
        Loading your workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 font-bold">
            T
          </div>
          <div>
            <h1 className="font-bold">Task Board</h1>
            <p className="text-xs text-slate-500">Your workspace</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Projects
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => setActiveProject(project._id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                activeProject === project._id
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="mr-2">▦</span>
              {project.name}
            </button>
          ))}
        </nav>

        <form onSubmit={handleCreateProject} className="mt-4 flex gap-2">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="New project"
            maxLength={100}
            aria-label="New project name"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button
            disabled={busy || !projectName.trim()}
            aria-label="Create project"
            className="rounded-lg bg-slate-800 px-3 text-indigo-300 hover:bg-slate-700 disabled:opacity-50"
          >
            +
          </button>
        </form>

        <div className="mt-8 border-t border-slate-800 pt-5 md:mt-auto">
          <p className="truncate text-sm font-medium">
            {user?.name || user?.email || "Signed-in user"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
          <button
            onClick={onLogout}
            className="mt-4 text-sm text-slate-400 hover:text-white"
          >
            Sign out ↗
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-indigo-400">WORKSPACE / PROJECTS</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {activeProjectName}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Keep your work moving, one task at a time.
            </p>
          </div>

          {activeProject && (
            <button
              onClick={handleDeleteProject}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:border-red-500/50 hover:text-red-400"
            >
              Delete project
            </button>
          )}
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {activeProject ? (
          <>
            <form
              onSubmit={handleCreateTask}
              className="mb-8 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row"
            >
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="What needs to get done?"
                maxLength={200}
                aria-label="Task title"
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              />

              <select
                value={taskPriority}
                onChange={(event) => setTaskPriority(event.target.value)}
                aria-label="Task priority"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm outline-none"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

              <button
                disabled={busy || !taskTitle.trim()}
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                + Add task
              </button>
            </form>

            <div className="grid gap-5 xl:grid-cols-3">
              {columns.map((column) => {
                const columnTasks = tasks.filter(
                  (task) => task.status === column.id,
                );

                return (
                  <section key={column.id} className="min-w-0">
                    <header className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${column.color}`}
                        />
                        <h3 className="font-semibold">{column.label}</h3>
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                          {columnTasks.length}
                        </span>
                      </div>
                    </header>

                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <article
                          key={task._id}
                          className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
                        >
                          <h4 className="wrap-break-words font-medium">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="mt-2 wrap-break-words text-sm text-slate-400">
                              {task.description}
                            </p>
                          )}

                          <p
                            className={`mt-4 text-xs font-semibold uppercase ${priorityColors[task.priority] || priorityColors.medium}`}
                          >
                            {task.priority || "medium"} priority
                          </p>

                          <div className="mt-4 flex items-center gap-2">
                            <select
                              aria-label={`Status for ${task.title}`}
                              value={task.status}
                              onChange={(event) =>
                                handleStatusChange(task, event.target.value)
                              }
                              className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-xs outline-none focus:border-indigo-500"
                            >
                              {columns.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              aria-label={`Delete ${task.title}`}
                              className="rounded-md px-2 py-2 text-slate-500 hover:bg-red-950 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-sm text-slate-600">
                          No tasks here yet
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center">
            <h3 className="text-xl font-semibold">Start with a project</h3>
            <p className="mt-2 text-sm text-slate-400">
              Create a project in the sidebar to start organizing tasks.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
