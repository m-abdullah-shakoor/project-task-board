import { useEffect, useState } from "react";
import {
  columns,
  dueDateKey,
  fieldClass,
  primaryButtonClass,
} from "../../utils/taskHelpers";

export default function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(dueDateKey(task.dueDate) || "");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saving, onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    if (!title.trim()) {
      setFormError("Task title is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      // An empty due date clears it on the server.
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
      });
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352B]/40 p-4"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E3E7DF] bg-white p-6 shadow-xl"
      >
        <h2
          id="task-modal-title"
          className="text-lg font-semibold text-[#26352B]"
        >
          Edit task
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-[#B42318]/20 bg-[#FEF3F2] p-3 text-sm text-[#B42318]"
            >
              {formError}
            </p>
          )}

          <label className="block text-sm font-medium text-[#26352B]">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
              autoFocus
              className={`${fieldClass} mt-1.5 block w-full px-3 py-2.5`}
            />
          </label>

          <label className="block text-sm font-medium text-[#26352B]">
            Description{" "}
            <span className="font-normal text-[#6B756C]">(optional)</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={3}
              className={`${fieldClass} mt-1.5 block w-full resize-y px-3 py-2.5`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#26352B]">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={`${fieldClass} mt-1.5 block w-full px-3 py-2.5`}
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-[#26352B]">
              Priority
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className={`${fieldClass} mt-1.5 block w-full px-3 py-2.5`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-[#26352B]">
            Due date{" "}
            <span className="font-normal text-[#6B756C]">(optional)</span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={`${fieldClass} mt-1.5 block w-full px-3 py-2.5`}
            />
          </label>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-[#D5DBD2] bg-white px-4 py-2.5 text-sm text-[#26352B] hover:bg-[#F7F7F2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`${primaryButtonClass} px-4 py-2.5`}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
