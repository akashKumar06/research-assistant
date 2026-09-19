import { Outlet } from "react-router";
import Header from "../Header";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px] dark:bg-fuchsia-500/10" />

      <Header />
      <main className="flex-1 overflow-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
