import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Board from "../components/Board/Board";
import { useBoard } from "../context/BoardContext";
import BoardBar from "../components/Board/BoardBar";

const BoardPage = () => {
  const { boardId } = useParams();
  const { state } = useBoard();
  const activeBoard = state.boards.find((b) => b.id === boardId);

  // Remember the last board so the Projects button can reopen it
  useEffect(() => {
    if (boardId) {
      try {
        localStorage.setItem("vellum_last_board", boardId);
      } catch {
        /* ignore */
      }
    }
  }, [boardId]);

  if (state.loading && !activeBoard) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading board…</p>
        </div>
      </div>
    );
  }

  if (!activeBoard) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* The fade lives on the content only, never on the sidebar or background */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden page-enter">
        <Header />
        <BoardBar board={activeBoard} />
        <Board board={activeBoard} />
      </div>
    </div>
  );
};

export default BoardPage;
