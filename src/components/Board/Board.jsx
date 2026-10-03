import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import BoardColumn from "./BoardColumn";
import TaskCard from "../Card/TaskCard";
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
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // ---- Helpers ----
  const findListByCardId = (cardId) =>
    board.lists.find((l) => l.cards.some((c) => c.id === cardId));

  const handleDragStart = (event) => {
    const { active } = event;
    const card = board.lists
      .flatMap((l) => l.cards)
      .find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceList = findListByCardId(activeId);
    if (!sourceList) return;

    // Determine destination list
    let destList;
    let destIndex;

    // If we dropped on a card
    if (over.data.current?.type === "card") {
      destList = findListByCardId(overId);
      if (!destList) return;
      destIndex = destList.cards.findIndex((c) => c.id === overId);
    }
    // If we dropped on a list area
    else if (over.data.current?.type === "list") {
      destList = board.lists.find((l) => l.id === overId);
      if (!destList) return;
      destIndex = destList.cards.length; // append
    } else {
      return;
    }

    const sourceIndex = sourceList.cards.findIndex((c) => c.id === activeId);

    // Nothing to do
    if (sourceList.id === destList.id && sourceIndex === destIndex) return;

    dispatch({
      type: "MOVE_CARD",
      payload: {
        boardId: board.id,
        fromListId: sourceList.id,
        toListId: destList.id,
        fromIndex: sourceIndex,
        toIndex: destIndex,
      },
    });
  };

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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

        {/* Drag Overlay: what the user sees while dragging */}
        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 cursor-grabbing">
              <TaskCard card={activeCard} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
