import { Menu, SquarePen, X } from "lucide-react";
import { useState } from "react";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-0 left-0 pt-4 pl-4 bg-[#282a2c] w-18 h-screen flex-col flex items-start justify-start transform transition-[width] duration-300 ease-in-out z-50 ${
        isOpen ? "w-72" : ""
      }`}
    >
      <div
        onClick={toggleSidebar}
        className="flex items-center justify-center p-2 w-10 h-10  hover:rounded-full hover:bg-hover-background"
      >
        {isOpen ? (
          <X className=" text-text-cl" />
        ) : (
          <Menu className=" text-text-cl" />
        )}
      </div>
      <div className="flex items-center mt-5">
        <div
          onClick={toggleSidebar}
          className="flex items-center justify-center p-2 w-10 h-10  hover:rounded-full hover:bg-hover-background"
        >
          <SquarePen className=" text-text-cl" />
        </div>

        <div
          className={`text-text-cl whitespace-nowrap overflow-hidden pr-4 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 max-w-full ml-2" : "opacity-0 max-w-0"
          }`}
        >
          New Chat
        </div>
      </div>
    </div>
  );
}
