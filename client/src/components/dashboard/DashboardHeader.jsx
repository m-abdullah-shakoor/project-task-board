// components/dashboard/ProjectHeader.jsx
import { isProjectActive } from "../../utils/taskHelpers";

export default function DashboardHeader({
  project,
  statusUpdating,
  onToggleActive,
  onEditProject,
  onDeleteProject,
  stats = [],
}) {
  const active = project ? isProjectActive(project) : false;

  return (
    <header className="w-full rounded-2xl border border-[#E3E7DF] bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Identity */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#66816A]">
            Workspace / Project
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="truncate text-2xl font-bold text-[#212522] sm:text-3xl">
              {project?.name || "Select a project"}
            </h2>
            {project && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  active
                    ? "bg-[#EDF2EB] text-[#536B57]"
                    : "bg-[#E3E7DF] text-[#6B756C]"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          {project?.description && (
            <p className="mt-2 whitespace-pre-line text-sm text-[#6B756C] wrap-anywhere">
              {project.description}
            </p>
          )}
        </div>

        {/* Actions */}
        {project && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEditProject}
              className="rounded-lg border border-[#D5DBD2] bg-white px-3 py-2 text-sm text-[#26352B] hover:bg-[#EDF2EB]"
            >
              Edit project
            </button>
            <button
              type="button"
              onClick={() => onToggleActive(project)}
              disabled={statusUpdating}
              className="rounded-lg border border-[#D5DBD2] bg-white px-3 py-2 text-sm text-[#26352B] hover:bg-[#EDF2EB] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusUpdating
                ? "Saving..."
                : active
                  ? "Mark as inactive"
                  : "Mark as active"}
            </button>
            <button
              type="button"
              onClick={onDeleteProject}
              className="rounded-lg border border-[#B42318]/20 bg-white px-3 py-2 text-sm text-[#B42318] hover:bg-[#FEF3F2]"
            >
              Delete project
            </button>
          </div>
        )}
      </div>

      {/* Task count strip */}
      {project && stats.length > 0 && (
        <dl className="grid grid-cols-2 border-t border-[#E3E7DF] sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center justify-between gap-3 border-[#E3E7DF] px-4 py-3 sm:px-5 [&:not(:last-child)]:sm:border-r [&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-[#6B756C]">
                <span className={`size-2 rounded-full ${stat.color}`} />
                {stat.label}
              </dt>
              <dd className="text-lg font-semibold text-[#26352B]">
                {stat.count}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}