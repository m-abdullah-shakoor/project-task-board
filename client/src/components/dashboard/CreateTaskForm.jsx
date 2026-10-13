const fieldClass =
  "rounded-lg border border-[#D5DBD2] bg-white text-sm text-[#26352B] outline-none placeholder:text-[#6B756C]/70 focus:border-[#66816A] focus:ring-2 focus:ring-[#66816A]/20";

export default function CreateTaskForm({
  taskTitle,
  setTaskTitle,
  taskPriority,
  setTaskPriority,
  onSubmit,
  busy,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 flex flex-col gap-3 rounded-xl border border-[#E3E7DF] bg-white p-4 shadow-sm sm:flex-row"
    >
      <input
        value={taskTitle}
        onChange={(event) => setTaskTitle(event.target.value)}
        placeholder="What needs to get done?"
        maxLength={200}
        aria-label="Task title"
        className={`${fieldClass} min-w-0 flex-1 px-4 py-3`}
      />

      <select
        value={taskPriority}
        onChange={(event) => setTaskPriority(event.target.value)}
        aria-label="Task priority"
        className={`${fieldClass} px-3 py-3`}
      >
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>

      <button
        disabled={busy || !taskTitle.trim()}
        className="rounded-lg bg-[#66816A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#536B57] disabled:cursor-not-allowed disabled:opacity-50"
      >
        + Add task
      </button>
    </form>
  );
}
