export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 animate-bounce" />
    </div>
  );
}
