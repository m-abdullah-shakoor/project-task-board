import { fieldClass, primaryButtonClass } from "../../utils/taskHelpers";

export default function TaskForm({
  title,
  description,
  priority,
  dueDate,
  busy,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 w-full space-y-3 rounded-xl border border-[#E3E7DF] bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="What needs to get done?"
          maxLength={200}
          aria-label="Task title"
          className={`${fieldClass} min-w-0 flex-1 px-4 py-3`}
        />

        <select
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
          aria-label="Task priority"
          className={`${fieldClass} px-3 py-3`}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
      </div>

      <textarea
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Description (optional)"
        maxLength={2000}
        rows={2}
        aria-label="Task description"
        className={`${fieldClass} block w-full resize-y px-4 py-3`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm text-[#6B756C]">
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
            className={`${fieldClass} min-w-0 flex-1 px-3 py-2 sm:flex-none`}
          />
        </label>

        <button
          disabled={busy || !title.trim()}
          className={`${primaryButtonClass} px-5 py-3`}
        >
          + Add task
        </button>
      </div>
    </form>
  );
}
