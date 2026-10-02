import React from "react";
import BoardColumn from "./BoardColumn";

const variantForIndex = (index) => {
  if (index === 0) return "todo";
  if (index === 1) return "inprogress";
  return "done";
};

const Board = ({ board }) => {
  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
      {/* Board Title */}
      <h1 className="text-center text-2xl font-serif text-gray-800 tracking-widest uppercase mb-6">
        {board.title}
      </h1>

      {/* Columns */}
      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {board.lists.map((list, idx) => (
          <BoardColumn
            key={list.id}
            list={list}
            variant={variantForIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
