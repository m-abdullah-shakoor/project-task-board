import BoardColumn from "./BoardColumn";

export default function TaskBoard({
  columns,
  filtersApplied,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}) {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          filtersApplied={filtersApplied}
          onStatusChange={onStatusChange}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
