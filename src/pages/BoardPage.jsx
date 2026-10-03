import React, { useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Board from "../components/Board/Board";
import { useBoard } from "../context/BoardContext";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

const BoardPage = () => {
  const { boardId } = useParams();
  const { state } = useBoard();
  const activeBoard = state.boards.find((b) => b.id === boardId);

  // We'll expose these via a ref/state that Board can consume
  const searchInputRef = useRef(null);

  useKeyboardShortcuts({
    "/": (e) => {
      e.preventDefault();
      // Focus search input inside FilterBar
      const input = document.querySelector(
        'input[placeholder="Search tasks..."]',
      );
      if (input) input.focus();
    },
  });

  if (!activeBoard) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Board board={activeBoard} />
      </div>
    </div>
  );
};

export default BoardPage;
