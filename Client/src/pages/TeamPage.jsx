import React from "react";
import Sidebar from "../components/Sidebar";
import TeamDirectory from "../components/Dashboard/TeamDirectory";

const TeamPage = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Team
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            People you collaborate with.
          </p>
        </div>

        <div className="max-w-2xl mb-6">
          <TeamDirectory />
        </div>

        <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-6 h-6 text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Invite teammates
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Collaboration features are coming soon.
          </p>
          <button
            disabled
            className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg opacity-60 cursor-not-allowed"
          >
            Invite (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
