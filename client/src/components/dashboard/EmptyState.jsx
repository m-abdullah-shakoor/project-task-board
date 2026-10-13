// Dashed placeholder used for the empty-project and empty-column messages.
export default function EmptyState({ title, className = "", children }) {
  return (
    <div
      className={`border border-dashed border-[#D5DBD2] text-center ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-[#26352B]">{title}</h3>
      )}
      {children}
    </div>
  );
}
