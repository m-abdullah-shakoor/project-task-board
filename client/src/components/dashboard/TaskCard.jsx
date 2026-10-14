import {
  columns,
  dueDateKey,
  fieldClass,
  formatDueDate,
  hasDueDate,
  priorityColors,
} from "../../utils/taskHelpers";

export default function TaskCard({
  task,
  overdue,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const dueKey = dueDateKey(task.dueDate);

  return (
    <article
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        overdue
          ? "border-[#B42318]/30"
          : "border-[#E3E7DF] hover:border-[#D5DBD2]"
      }`}
    >
      <h4 className="font-medium text-[#26352B] wrap-anywhere">{task.title}</h4>

      {task.description && (
        <p className="mt-2 text-sm text-[#6B756C] wrap-anywhere">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span
          className={`font-semibold uppercase ${priorityColors[task.priority] || priorityColors.medium}`}
        >
          {task.priority || "medium"} priority
        </span>
        {hasDueDate(task) && (
          <span
            className={
              overdue ? "font-semibold text-[#B42318]" : "text-[#6B756C]"
            }
          >
            {dueKey
              ? `${overdue ? "Overdue · due" : "Due"} ${formatDueDate(dueKey)}`
              : "Invalid due date"}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <select
          aria-label={`Status for ${task.title}`}
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value)}
          className={`${fieldClass} min-w-0 flex-1 rounded-md px-2 py-2 text-xs`}
        >
          {columns.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.title}`}
          className="rounded-md px-2 py-2 text-sm text-[#536B57] hover:bg-[#EDF2EB]"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task._id)}
          aria-label={`Delete ${task.title}`}
          className="rounded-md px-2 py-2 text-sm text-[#B42318] hover:bg-[#FEF3F2]"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
