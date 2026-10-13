import React from "react";

const NewBoardCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-left flex items-center gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:bg-blue-700 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          New Board
        </p>
        <p className="text-[11px] text-gray-400">
          Create a board to organize tasks
        </p>
      </div>
    </button>
  );
};

export default NewBoardCard;
