import { fieldClass, primaryButtonClass } from "../../utils/taskHelpers";

export default function ProjectModal({
  name,
  description,
  formError,
  busy,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#26352B]/40 p-4"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#E3E7DF] bg-white p-6 shadow-xl"
      >
        <h2
          id="project-modal-title"
          className="text-lg font-semibold text-[#26352B]"
        >
          New project
        </h2>

        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-[#B42318]/20 bg-[#FEF3F2] p-3 text-sm text-[#B42318]"
            >
              {formError}
            </p>
          )}

          <label className="block text-sm font-medium text-[#26352B]">
            Name
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={100}
              required
              autoFocus
              placeholder="e.g. Website relaunch"
              className={`${fieldClass} mt-1.5 block w-full px-3 py-2.5`}
            />
          </label>

          <label className="block text-sm font-medium text-[#26352B]">
            Description{" "}
            <span className="font-normal text-[#6B756C]">(optional)</span>
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="What is this project about?"
              className={`${fieldClass} mt-1.5 block w-full resize-y px-3 py-2.5`}
            />
          </label>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg border border-[#D5DBD2] bg-white px-4 py-2.5 text-sm text-[#26352B] hover:bg-[#F7F7F2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className={`${primaryButtonClass} px-4 py-2.5`}
            >
              {busy ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
