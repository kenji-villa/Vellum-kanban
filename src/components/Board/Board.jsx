import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const findListByCardId = (cardId) =>
    board.lists.find((l) => l.cards.some((c) => c.id === cardId));

  const handleDragStart = (event) => {
    const { active } = event;
    const type = active.data.current?.type;

    if (type === "column") {
      const list = board.lists.find((l) => l.id === active.id);
      setActiveItem({ type: "column", data: list });
      return;
    }

    // card
    const card = board.lists
      .flatMap((l) => l.cards)
      .find((c) => c.id === active.id);
    setActiveItem({ type: "card", data: card });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const currentActive = activeItem;
    setActiveItem(null);

    if (!over) return;

    // ---------- COLUMN REORDER ----------
    if (currentActive?.type === "column") {
      const overType = over.data.current?.type;

      // Find the column we dropped onto
      let overListId = null;
      if (overType === "column") overListId = over.id;
      else if (overType === "list") overListId = over.data.current.listId;
      else if (overType === "card") {
        const cardList = findListByCardId(over.id);
        if (cardList) overListId = cardList.id;
      }

      if (!overListId || overListId === active.id) return;

      const fromIndex = board.lists.findIndex((l) => l.id === active.id);
      const toIndex = board.lists.findIndex((l) => l.id === overListId);
      if (fromIndex === -1 || toIndex === -1) return;

      dispatch({
        type: "REORDER_LIST",
        payload: { boardId: board.id, fromIndex, toIndex },
      });
      return;
    }

    // ---------- CARD MOVE / REORDER ----------
    if (currentActive?.type === "card") {
      const activeId = active.id;
      const overId = over.id;

      const sourceList = findListByCardId(activeId);
      if (!sourceList) return;

      let destList;
      let destIndex;

      if (over.data.current?.type === "card") {
        destList = findListByCardId(overId);
        if (!destList) return;
        destIndex = destList.cards.findIndex((c) => c.id === overId);
      } else if (over.data.current?.type === "list") {
        destList = board.lists.find((l) => l.id === over.data.current.listId);
        if (!destList) return;
        destIndex = destList.cards.length;
      } else if (over.data.current?.type === "column") {
        // Dropped on a column header — append to end of that column
        destList = board.lists.find((l) => l.id === over.id);
        if (!destList) return;
        destIndex = destList.cards.length;
      } else {
        return;
      }

      const sourceIndex = sourceList.cards.findIndex((c) => c.id === activeId);
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
    }
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

  const listIds = board.lists.map((l) => l.id);

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
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4 items-start">
          <SortableContext
            items={listIds}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list, idx) => (
              <BoardColumn
                key={list.id}
                boardId={board.id}
                list={list}
                variant={variantForIndex(idx)}
              />
            ))}
          </SortableContext>

          {/* Add List */}
          <div className="min-w-[280px] max-w-[320px] flex flex-col">
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
                className="bg-white/60 hover:bg-white border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors w-full"
              >
                + Add List
              </button>
            )}
          </div>
        </div>

        {/* DragOverlay — shows a preview of whatever is being dragged */}
        <DragOverlay>
          {activeItem?.type === "card" && activeItem.data ? (
            <div className="rotate-3 cursor-grabbing">
              <TaskCard card={activeItem.data} onClick={() => {}} />
            </div>
          ) : activeItem?.type === "column" && activeItem.data ? (
            <div className="rotate-2 cursor-grabbing w-[280px]">
              {/* Lightweight column preview */}
              <div className="bg-[#1e2757] text-white rounded-t-xl px-4 py-3 shadow-2xl">
                <h2 className="font-semibold text-sm tracking-wide">
                  {activeItem.data.title}
                </h2>
              </div>
              <div className="bg-gray-200/70 rounded-b-xl p-3 flex flex-col gap-2 min-h-[100px] shadow-xl">
                {activeItem.data.cards.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-lg p-2 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    {c.title}
                  </div>
                ))}
                {activeItem.data.cards.length > 2 && (
                  <div className="text-[11px] text-gray-500 text-center">
                    +{activeItem.data.cards.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
