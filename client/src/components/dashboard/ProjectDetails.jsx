import { isProjectActive } from "../../utils/taskHelpers";

export default function ProjectDetails({
  project,
  statusUpdating,
  onToggleActive,
}) {
  const active = isProjectActive(project);

  return (
    <div className="w-full">
      {/* Status and actions — top right */}
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            active
              ? "bg-[#EDF2EB] text-[#536B57]"
              : "bg-[#E3E7DF] text-[#6B756C]"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>

        <button
          type="button"
          onClick={() => onToggleActive(project)}
          disabled={statusUpdating}
          className="rounded-lg border border-[#D5DBD2] bg-white px-3 py-1.5 text-sm font-medium text-[#26352B] transition hover:bg-[#EDF2EB] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {statusUpdating
            ? "Saving..."
            : active
              ? "Mark as inactive"
              : "Mark as active"}
        </button>
      </div>

      {/* Description — bottom left, full available width */}
      {project.description && (
        <div className="w-full border-t border-[#E3E7DF] pt-3">
          <p className="whitespace-pre-line text-sm leading-6 text-[#6B756C] [overflow-wrap:anywhere]">
            {project.description}
          </p>
        </div>
      )}
    </div>
  );
}
