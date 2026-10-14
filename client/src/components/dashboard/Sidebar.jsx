import { useState } from "react";
import ProjectList from "./ProjectList";
import { fieldClass } from "../../utils/taskHelpers";

// Shows the Google profile picture, or the user's initial when there is no
// picture (email signups) or it fails to load.
function UserAvatar({ user }) {
  const [failed, setFailed] = useState(false);
  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  if (user?.picture && !failed) {
    return (
      <img
        src={user.picture}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-10 shrink-0 rounded-full border border-[#E3E7DF] object-cover"
      />
    );
  }

  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EDF2EB] text-sm font-semibold text-[#536B57]">
      {initial}
    </div>
  );
}

export default function Sidebar({
  projects,
  visibleProjects,
  activeProject,
  projectFilter,
  onProjectFilterChange,
  onSelectProject,
  onAddProject,
  user,
  onLogout,
}) {
  return (
    <aside className="flex w-full flex-col border-b border-[#E3E7DF] bg-white p-5 md:min-h-screen md:w-72 md:shrink-0 md:border-b-0 md:border-r">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[#66816A] font-bold text-white">
          T
        </div>
        <div>
          <h1 className="font-bold text-[#26352B] text-2xl">Task Board</h1>
          <p className="text-xs text-[#6B756C]">Your workspace</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B756C]">
          Projects
        </p>
        <label htmlFor="project-filter" className="sr-only">
          Filter projects
        </label>
        <select
          id="project-filter"
          value={projectFilter}
          onChange={(event) => onProjectFilterChange(event.target.value)}
          className={`${fieldClass} px-2 py-1 text-xs`}
        >
          <option value="all">All Projects</option>
          <option value="active">Active Projects</option>
          <option value="inactive">Inactive Projects</option>
        </select>
      </div>

      <ProjectList
        projects={visibleProjects}
        activeProject={activeProject}
        onSelectProject={onSelectProject}
      />

      {projects.length > 0 && visibleProjects.length === 0 && (
        <p className="text-sm text-[#6B756C]">
          No {projectFilter === "active" ? "active" : "inactive"} projects.
        </p>
      )}

      <button
        type="button"
        onClick={onAddProject}
        className="mt-4 rounded-lg border border-[#D5DBD2] bg-white px-3 py-2 text-sm font-medium text-[#536B57] hover:bg-[#EDF2EB]"
      >
        + Add project
      </button>

      <div className="mt-8 border-t border-[#E3E7DF] pt-5 md:mt-auto">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#26352B]">
              {user?.name || user?.email || "Signed-in user"}
            </p>
            <p className="mt-1 truncate text-xs text-[#6B756C]">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 rounded-md text-sm text-[#6B756C] hover:text-[#26352B]"
        >
          Sign out ↗
        </button>
      </div>
    </aside>
  );
}
