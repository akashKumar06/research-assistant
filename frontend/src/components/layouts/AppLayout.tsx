import { Outlet } from "react-router";
import Header from "../Header";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
