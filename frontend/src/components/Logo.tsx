import { cn } from "@/lib/utils";

export default function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-md shadow-indigo-500/30">
        <span className="text-sm font-extrabold text-white">N</span>
      </div>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Nexus
        </span>
      )}
    </div>
  );
}
