export default function CreateProjectForm({
  projectName,
  setProjectName,
  onSubmit,
  busy,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2">
      <input
        value={projectName}
        onChange={(event) => setProjectName(event.target.value)}
        placeholder="New project"
        maxLength={100}
        aria-label="New project name"
        className="min-w-0 flex-1 rounded-lg border border-[#D5DBD2] bg-white px-3 py-2 text-sm text-[#26352B] outline-none placeholder:text-[#6B756C]/70 focus:border-[#66816A] focus:ring-2 focus:ring-[#66816A]/20"
      />
      <button
        disabled={busy || !projectName.trim()}
        aria-label="Create project"
        className="rounded-lg bg-[#66816A] px-3 text-white hover:bg-[#536B57] disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </form>
  );
}
