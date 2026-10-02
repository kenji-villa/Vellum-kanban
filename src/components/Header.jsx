import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Projects", path: "/board/board-1" },
  { name: "Team", path: "/settings" },
  { name: "Settings", path: "/settings" },
];

const Header = () => {
  return (
    <header className="h-16 bg-gray-100 flex items-center justify-between px-8 border-b border-gray-200">
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">Vellum</h1>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center -space-x-2">
          <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-gray-100 flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-gray-100 flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
