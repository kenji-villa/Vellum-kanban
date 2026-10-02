import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Board from "../components/Board/Board";
import { initialData } from "../data/initialData";

const BoardPage = () => {
  const activeBoard = initialData.boards[0];

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
