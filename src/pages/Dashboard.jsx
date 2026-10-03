import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Dashboard/DashboardTopbar";
import Calendar from "../components/Calendar/Calendar";
import UrgentTasks from "../components/Dashboard/UrgentTasks";
import ProjectDirectory from "../components/Dashboard/ProjectDirectory";
import NewComments from "../components/Dashboard/NewComments";
import TeamDirectory from "../components/Dashboard/TeamDirectory";
import { useBoard } from "../context/BoardContext";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const { state, dispatch } = useBoard();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const handleAddBoard = () => {
    const title = window.prompt("Board name:", "New Board");
    if (title?.trim()) {
      dispatch({ type: "ADD_BOARD", payload: { title: title.trim() } });
      toast.success(`Board "${title.trim()}" created`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />

      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <DashboardTopbar />

        {/* Main Grid — Skeleton OR Real */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
            <div className="space-y-5">
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-52" />
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-64" />
            </div>
            <div className="space-y-5">
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-52" />
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-64" />
            </div>
            <div className="space-y-5">
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-52" />
              <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl h-64" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {/* ---- Column 1 ---- */}
              <div className="space-y-5">
                <Calendar />
                <ProjectDirectory />
              </div>

              {/* ---- Column 2 ---- */}
              <div className="space-y-5">
                <UrgentTasks />
                <TeamDirectory />
              </div>

              {/* ---- Column 3 ---- */}
              <div className="space-y-5">
                <NewComments />
              </div>
            </div>

            {/* Your Boards Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Your Boards
                </h2>
                <button
                  onClick={handleAddBoard}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  + New Board
                </button>
              </div>

              {state.boards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                    No boards yet
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Create your first board to get started
                  </p>
                  <button
                    onClick={handleAddBoard}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    + Create Board
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {state.boards.map((board) => (
                    <Link
                      key={board.id}
                      to={`/board/${board.id}`}
                      className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700"
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate">
                        {board.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {board.lists.length} lists ·{" "}
                        {board.lists.reduce(
                          (acc, l) => acc + l.cards.length,
                          0,
                        )}{" "}
                        cards
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
