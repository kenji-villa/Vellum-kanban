import React from "react";

const DashboardTopbar = () => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Dawit!</h1>
        <p className="text-gray-500 mt-1">Here is your agenda for today</p>
      </div>

      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-200/70 rounded-xl pl-4 pr-10 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
      </div>
    </div>
  );
};

export default DashboardTopbar;
