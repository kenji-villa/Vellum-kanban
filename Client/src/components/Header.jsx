import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./UI/NotificationBell";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:4000";
  const avatarUrl = user?.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null;

  return (
    <header className="h-16 bg-gray-100 dark:bg-[#0f172a] flex items-center justify-between px-8 border-b border-gray-200 dark:border-slate-800 shrink-0">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        Vellum
      </h1>

      <div className="flex items-center gap-4">
        {/* Team link only */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/team"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`
            }
          >
            Team
          </NavLink>
        </nav>

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar — navigates to profile page */}
        <button
          onClick={() => navigate("/profile")}
          title="View profile"
          className="w-9 h-9 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] flex items-center justify-center text-white text-xs font-bold transition-opacity ring-2 ring-transparent hover:ring-[var(--accent-ring)] overflow-hidden"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
