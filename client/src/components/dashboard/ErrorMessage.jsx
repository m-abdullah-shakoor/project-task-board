export default function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-[#B42318]/20 bg-[#FEF3F2] p-3 text-sm text-[#B42318]"
    >
      {message}
    </div>
  );
}
