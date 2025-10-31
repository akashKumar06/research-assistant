import { GraduationCap, Library, Menu, SquarePen, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  console.log(isOpen);
  return (
    <div
      className={`pt-4 pl-4 pr-4 bg-[#282a2c] w-18 h-full flex-col flex items-start justify-start transform transition-[width] duration-300 ease-in-out z-50 ${
        isOpen ? "w-64" : ""
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

      <Link
        to="/"
        className={`flex items-center mt-5 w-full cursor-pointer ${
          isOpen ? "hover:bg-hover-background hover:rounded-md" : ""
        }`}
      >
        <div
          onClick={toggleSidebar}
          className={`flex items-center justify-center p-2 w-10 h-10  ${
            !isOpen ? "hover:rounded-full hover:bg-hover-background" : ""
          }`}
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
      </Link>

      <Link
        to="library"
        className={`flex items-center w-full cursor-pointer ${
          isOpen ? "hover:bg-hover-background hover:rounded-md" : ""
        }`}
      >
        <div
          onClick={toggleSidebar}
          className={`flex items-center justify-center p-2 w-10 h-10  ${
            !isOpen ? "hover:rounded-full hover:bg-hover-background" : ""
          }`}
        >
          <Library className=" text-text-cl" />
        </div>

        <div
          className={`text-text-cl whitespace-nowrap overflow-hidden pr-4 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 max-w-full ml-2" : "opacity-0 max-w-0"
          }`}
        >
          Library
        </div>
      </Link>

      <Link
        to="scholars"
        className={`flex items-center w-full cursor-pointer ${
          isOpen ? "hover:bg-hover-background hover:rounded-md" : ""
        }`}
      >
        <div
          onClick={toggleSidebar}
          className={`flex items-center justify-center p-2 w-10 h-10  ${
            !isOpen ? "hover:rounded-full hover:bg-hover-background" : ""
          }`}
        >
          <GraduationCap className=" text-text-cl" />
        </div>

        <div
          className={`text-text-cl whitespace-nowrap overflow-hidden pr-4 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 max-w-full ml-2" : "opacity-0 max-w-0"
          }`}
        >
          Scholars
        </div>
      </Link>
    </div>
  );
}
