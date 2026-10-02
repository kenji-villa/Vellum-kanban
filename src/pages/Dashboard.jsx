import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Dashboard/DashboardTopbar";
import Calendar from "../components/Calendar/Calendar";
import UrgentTasks from "../components/Dashboard/UrgentTasks";
import ProjectDirectory from "../components/Dashboard/ProjectDirectory";
import NewComments from "../components/Dashboard/NewComments";
import TeamDirectory from "../components/Dashboard/TeamDirectory";
import { useBoard } from "../context/BoardContext";

const Dashboard = () => {
  const { state, dispatch } = useBoard();

  const handleAddBoard = () => {
    const title = window.prompt("Board name:", "New Board");
    if (title?.trim()) {
      dispatch({ type: "ADD_BOARD", payload: { title: title.trim() } });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0efeb]">
      <Sidebar />
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <DashboardTopbar />

        {/* Row 1: Calendar + Urgent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <Calendar />
          <UrgentTasks />
        </div>

        {/* Row 2: Projects + Comments/Tags + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <ProjectDirectory />
          <NewComments />
          <TeamDirectory />
        </div>

        {/* Boards section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Your Boards</h2>
            <button
              onClick={handleAddBoard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              + New Board
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.boards.map((board) => (
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="font-semibold text-gray-800 mb-1">
                  {board.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {board.lists.length} lists ·{" "}
                  {board.lists.reduce((acc, l) => acc + l.cards.length, 0)}{" "}
                  cards
                </p>
              </Link>
            ))}
            {state.boards.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                No boards yet. Create your first one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
