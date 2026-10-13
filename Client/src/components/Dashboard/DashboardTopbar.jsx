import React from "react";
import { useSettings } from "../../context/SettingsContext";

const DashboardTopbar = () => {
  const { settings } = useSettings();
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5">
        Welcome, {settings.userName.split(" ")[0]}!
      </h1>

      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search projects, tasks, or people..."
          className="w-full bg-white dark:bg-slate-800 dark:text-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
};

export default DashboardTopbar;
