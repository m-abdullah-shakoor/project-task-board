export default function ProjectList({ projects, activeProject, onSelectProject }) {
  return (
    <nav className="flex flex-wrap gap-2 md:flex-col">
      {projects.map((project) => (
        <button
          key={project._id}
          onClick={() => onSelectProject(project._id)}
          className={`rounded-lg px-3 py-2 text-left text-sm transition ${
            activeProject === project._id
              ? "bg-[#EDF2EB] font-medium text-[#536B57]"
              : "text-[#6B756C] hover:bg-[#F7F7F2] hover:text-[#26352B]"
          }`}
        >
          <span className="mr-2">▦</span>
          {project.name}
        </button>
      ))}
    </nav>
  );
}
