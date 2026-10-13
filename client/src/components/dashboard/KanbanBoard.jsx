import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  columns,
  tasks,
  onStatusChange,
  onDeleteTask,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasks.filter((task) => task.status === column.id)}
          statusOptions={columns}
          onStatusChange={onStatusChange}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
