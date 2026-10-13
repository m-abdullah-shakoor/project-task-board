import { columns, fieldClass } from "../../utils/taskHelpers";

export default function TaskFilters({
  search,
  statusFilter,
  dueFilter,
  onSearchChange,
  onStatusFilterChange,
  onDueFilterChange,
}) {
  return (
    <div className="mb-6 grid w-full gap-3 sm:grid-cols-3">
      <label className="text-xs font-medium text-[#6B756C]">
        Search
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Title or description"
          className={`${fieldClass} mt-1 block w-full px-3 py-2`}
        />
      </label>
      <label className="text-xs font-medium text-[#6B756C]">
        Status
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className={`${fieldClass} mt-1 block w-full px-3 py-2`}
        >
          <option value="all">All Tasks</option>
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.label}
            </option>
          ))}
          <option value="overdue">Overdue</option>
        </select>
      </label>
      <label className="text-xs font-medium text-[#6B756C]">
        Due date
        <select
          value={dueFilter}
          onChange={(event) => onDueFilterChange(event.target.value)}
          className={`${fieldClass} mt-1 block w-full px-3 py-2`}
        >
          <option value="all">All Due Dates</option>
          <option value="none">No Due Date</option>
          <option value="today">Due Today</option>
          <option value="overdue">Overdue</option>
          <option value="later">Due Later</option>
        </select>
      </label>
    </div>
  );
}
