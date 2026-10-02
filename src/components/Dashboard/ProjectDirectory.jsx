import React from "react";
import { Link } from "react-router-dom";
import { useBoard } from "../../context/BoardContext";

// Deterministic accent color per board
const accents = [
  "bg-teal-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-pink-400",
];
const accentFor = (id) => {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return accents[sum % accents.length];
};

const ProjectDirectory = () => {
  const { state } = useBoard();
  const boards = state.boards.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">
        Project Directory
      </h3>

      {boards.length === 0 ? (
        <div className="text-xs text-gray-400 py-6 text-center">
          No boards yet
        </div>
      ) : (
        <ul className="space-y-2.5">
          {boards.map((board) => {
            const totalCards = board.lists.reduce(
              (acc, l) => acc + l.cards.length,
              0,
            );
            return (
              <li key={board.id}>
                <Link
                  to={`/board/${board.id}`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`w-8 h-8 rounded-lg ${accentFor(board.id)} shrink-0`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {board.title}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {board.lists.length} lists · {totalCards} cards
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to="/dashboard"
        className="mt-4 block w-full text-center border border-gray-200 rounded-lg py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        + Add more
      </Link>
    </div>
  );
};

export default ProjectDirectory;
