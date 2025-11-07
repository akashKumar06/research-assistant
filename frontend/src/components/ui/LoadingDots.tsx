export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 p-4">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
      </div>
      <span className="text-sm text-zinc-400 ml-2">AI is thinking...</span>
    </div>
  );
}