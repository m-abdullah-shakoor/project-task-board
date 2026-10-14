// Shared constants and pure helpers, moved unchanged from Dashboard.jsx so
// the page and its UI components read them from one place.

export const columns = [
  { id: "todo", label: "To Do", color: "bg-slate-500" },
  { id: "in-progress", label: "In Progress", color: "bg-indigo-500" },
  { id: "completed", label: "Completed", color: "bg-emerald-500" },
];

export const overdueColumn = {
  id: "overdue",
  label: "Overdue",
  color: "bg-[#B42318]",
};

export const priorityColors = {
  low: "text-slate-500",
  medium: "text-amber-700",
  high: "text-red-700",
};

export const fieldClass =
  "rounded-lg border border-[#D5DBD2] bg-white text-sm text-[#26352B] outline-none placeholder:text-[#6B756C]/70 focus:border-[#66816A] focus:ring-2 focus:ring-[#66816A]/20 disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButtonClass =
  "rounded-lg bg-[#66816A] text-sm font-semibold text-white hover:bg-[#536B57] disabled:cursor-not-allowed disabled:opacity-50";


export function isProjectActive(project) {
  return project.isActive !== false;
}

export function dueDateKey(dueDate) {
  if (typeof dueDate !== "string") return null;
  const key = dueDate.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(Date.parse(key))
    ? key
    : null;
}

export function hasDueDate(task) {
  return (
    task.dueDate !== null && task.dueDate !== undefined && task.dueDate !== ""
  );
}

export function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isOverdue(task, today) {
  const key = dueDateKey(task.dueDate);
  return task.status !== "completed" && key !== null && key < today;
}

export function formatDueDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function matchesDueFilter(task, filter, today) {
  const key = dueDateKey(task.dueDate);
  switch (filter) {
    case "none":
      return !hasDueDate(task);
    case "today":
      return key === today;
    case "overdue":
      return isOverdue(task, today);
    case "later":
      return key !== null && key > today;
    default:
      return true;
  }
}
