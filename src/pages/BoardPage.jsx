import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Board from "../components/Board/Board";
import { useBoard } from "../context/BoardContext";

const BoardPage = () => {
  const { boardId } = useParams();
  const { state } = useBoard();
  const activeBoard = state.boards.find((b) => b.id === boardId);

  if (!activeBoard) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Board board={activeBoard} />
      </div>
    </div>
  );
};

export default BoardPage;
