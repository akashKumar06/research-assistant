import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router";

function HomePage() {
  return (
    <div className="p-1 h-screen w-full">
      <div className="h-full bg-black rounded overflow-hidden flex">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
