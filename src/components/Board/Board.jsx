import React, { useState } from "react";
import BoardColumn from "./BoardColumn";
import { useBoard } from "../../context/BoardContext";

const variantForIndex = (index) => {
  if (index === 0) return "todo";
  if (index === 1) return "inprogress";
  return "done";
};

const Board = ({ board }) => {
  const { dispatch } = useBoard();
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = () => {
    if (newListTitle.trim()) {
      dispatch({
        type: "ADD_LIST",
        payload: { boardId: board.id, title: newListTitle.trim() },
      });
    }
    setNewListTitle("");
    setAddingList(false);
  };

  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
      <h1 className="text-center text-2xl font-serif text-gray-800 tracking-widest uppercase mb-6">
        {board.title}
      </h1>

      <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
        {board.lists.map((list, idx) => (
          <BoardColumn
            key={list.id}
            boardId={board.id}
            list={list}
            variant={variantForIndex(idx)}
          />
        ))}

        {/* Add List */}
        <div className="min-w-[280px] flex flex-col">
          {addingList ? (
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddList()}
                placeholder="List title..."
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAddingList(false);
                    setNewListTitle("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 text-sm py-1.5 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingList(true)}
              className="bg-white/60 hover:bg-white border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              + Add List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
