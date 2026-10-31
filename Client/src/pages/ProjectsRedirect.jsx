import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useBoard } from "../context/BoardContext";

const ProjectsRedirect = () => {
  const { state } = useBoard();

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading projects…</p>
        </div>
      </div>
    );
  }

  const first = state.boards[0];
  return <Navigate to={first ? `/board/${first.id}` : "/dashboard"} replace />;
};

export default ProjectsRedirect;
