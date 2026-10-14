import EmptyState from "./EmptyState";
import TaskCard from "./TaskCard";

export default function BoardColumn({
  column,
  filtersApplied,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}) {
  return (
    <section className="min-w-0">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-[#26352B]">{column.label}</h3>
          <span className="rounded-md border border-[#E3E7DF] bg-white px-2 py-0.5 text-xs text-[#6B756C]">
            {column.tasks.length}
          </span>
        </div>
      </header>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            overdue={column.id === "overdue"}
            onStatusChange={onStatusChange}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {column.tasks.length === 0 && (
          <EmptyState className="rounded-xl p-6 text-sm text-[#6B756C]">
            {filtersApplied ? "No matching tasks" : "No tasks here yet"}
          </EmptyState>
        )}
      </div>
    </section>
  );
}
