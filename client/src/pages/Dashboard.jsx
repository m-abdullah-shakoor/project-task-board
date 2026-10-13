import { useEffect, useState } from "react";
import {
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProjects,
  getTasks,
  updateProject,
  updateTask,
} from "../services/api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import EmptyState from "../components/dashboard/EmptyState";
import ErrorMessage from "../components/dashboard/ErrorMessage";
import LoadingScreen from "../components/dashboard/LoadingScreen";
import ProjectModal from "../components/dashboard/ProjectModal";
import Sidebar from "../components/dashboard/Sidebar";
import TaskBoard from "../components/dashboard/TaskBoard";
import TaskFilters from "../components/dashboard/TaskFilters";
import TaskForm from "../components/dashboard/TaskForm";
import {
  columns,
  isOverdue,
  isProjectActive,
  matchesDueFilter,
  overdueColumn,
  todayKey,
} from "../utils/taskHelpers";

export default function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectFormError, setProjectFormError] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");
  const [taskDueFilter, setTaskDueFilter] = useState("all");
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

  useEffect(() => {
    if (!projectModalOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !busy) closeProjectModal();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [projectModalOpen, busy]);

  function openProjectModal() {
    setProjectName("");
    setProjectDescription("");
    setProjectFormError("");
    setProjectModalOpen(true);
  }

  function closeProjectModal() {
    setProjectModalOpen(false);
    setProjectFormError("");
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    if (busy) return;
    if (!projectName.trim()) {
      setProjectFormError("Project name is required.");
      return;
    }

    setBusy(true);
    setError("");
    setProjectFormError("");

    try {
      // isActive is omitted: the server defaults new projects to active.
      const result = await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      const project = result.data;

      setProjects((current) => [project, ...current]);
      setActiveProject(project._id);
      setProjectName("");
      setProjectDescription("");
      setProjectModalOpen(false);
    } catch (err) {
      setProjectFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleProjectActive(project) {
    if (statusUpdating) return;
    const nextActive = !isProjectActive(project);

    setStatusUpdating(true);
    setError("");

    try {
      const result = await updateProject(project._id, { isActive: nextActive });
      const updated = result.data;

      // Only report success if the server actually saved the new value.
      if (!updated || updated.isActive !== nextActive) {
        throw new Error("The server did not save the project's active status.");
      }

      setProjects((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusUpdating(false);
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
        description: taskDescription.trim(),
        priority: taskPriority,
        ...(taskDueDate ? { dueDate: taskDueDate } : {}),
      });

      setTasks((current) => [result.data, ...current]);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("medium");
      setTaskDueDate("");
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

  const activeProjectData = projects.find(
    (project) => project._id === activeProject,
  );

  // Filtering only changes what is listed; the selection is left untouched.
  const visibleProjects = projects.filter((project) => {
    if (projectFilter === "active") return isProjectActive(project);
    if (projectFilter === "inactive") return !isProjectActive(project);
    return true;
  });

  const today = todayKey();
  const searchTerm = taskSearch.trim().toLowerCase();
  const filtersApplied =
    Boolean(searchTerm) ||
    taskStatusFilter !== "all" ||
    taskDueFilter !== "all";

  const filteredTasks = tasks.filter((task) => {
    if (
      searchTerm &&
      !task.title.toLowerCase().includes(searchTerm) &&
      !(task.description || "").toLowerCase().includes(searchTerm)
    ) {
      return false;
    }
    if (taskStatusFilter === "overdue") {
      if (!isOverdue(task, today)) return false;
    } else if (taskStatusFilter !== "all" && task.status !== taskStatusFilter) {
      return false;
    }
    return matchesDueFilter(task, taskDueFilter, today);
  });

  // Overdue tasks move to their own section instead of their status column.
  const boardColumns = [...columns, overdueColumn].map((column) => ({
    ...column,
    tasks: filteredTasks.filter((task) =>
      column.id === "overdue"
        ? isOverdue(task, today)
        : task.status === column.id && !isOverdue(task, today),
    ),
  }));
  const projectStats = [...columns, overdueColumn].map((column) => ({
    id: column.id,
    label: column.label,
    color: column.color,
    count: tasks.filter((task) =>
      column.id === "overdue"
        ? isOverdue(task, today)
        : task.status === column.id && !isOverdue(task, today),
    ).length,
  }));

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F7F2] text-[#26352B] md:flex ">
      <Sidebar
        projects={projects}
        visibleProjects={visibleProjects}
        activeProject={activeProject}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        onSelectProject={setActiveProject}
        onAddProject={openProjectModal}
        user={user}
        onLogout={onLogout}
      />

      <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
        <div className="w-full space-y-6">
          <DashboardHeader
            project={activeProjectData}
            statusUpdating={statusUpdating}
            onToggleActive={handleToggleProjectActive}
            onDeleteProject={handleDeleteProject}
            stats={projectStats}
          />

          {error && <ErrorMessage message={error} />}

          {activeProject ? (
            <>
              <TaskForm
                title={taskTitle}
                description={taskDescription}
                priority={taskPriority}
                dueDate={taskDueDate}
                busy={busy}
                onTitleChange={setTaskTitle}
                onDescriptionChange={setTaskDescription}
                onPriorityChange={setTaskPriority}
                onDueDateChange={setTaskDueDate}
                onSubmit={handleCreateTask}
              />

              <TaskFilters
                search={taskSearch}
                statusFilter={taskStatusFilter}
                dueFilter={taskDueFilter}
                onSearchChange={setTaskSearch}
                onStatusFilterChange={setTaskStatusFilter}
                onDueFilterChange={setTaskDueFilter}
              />

              <div className="rounded-2xl border border-[#E3E7DF] bg-[#F0F1E9] p-3 sm:p-4">
                <TaskBoard
                  columns={boardColumns}
                  filtersApplied={filtersApplied}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="Start with a project"
              className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5DBD2] bg-white p-8 text-center sm:p-12"
            >
              <p className="mt-3 max-w-md text-sm leading-6 text-[#6B756C]">
                Create a project from the sidebar to start organizing tasks,
                setting deadlines, and tracking your progress.
              </p>
            </EmptyState>
          )}
        </div>
      </section>

      {projectModalOpen && (
        <ProjectModal
          name={projectName}
          description={projectDescription}
          formError={projectFormError}
          busy={busy}
          onNameChange={setProjectName}
          onDescriptionChange={setProjectDescription}
          onSubmit={handleCreateProject}
          onClose={closeProjectModal}
        />
      )}
    </main>
  );
}
