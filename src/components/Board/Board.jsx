import React, { useState, useMemo } from "react";
import { useToast } from "../../context/ToastContext";
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
import FilterBar from "./FilterBar";
import { useBoard } from "../../context/BoardContext";
import { filterBoard, emptyFilters } from "../../utils/filters";

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
  const toast = useToast();

  // ---- Search & Filter state (view-only, not persisted) ----
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptyFilters);

  // ---- Compute visible board based on filters ----
  const visibleBoard = useMemo(
    () => filterBoard(board, query, filters),
    [board, query, filters],
  );

  // ---- Counts for the counter ----
  const totalCards = board.lists.reduce((acc, l) => acc + l.cards.length, 0);
  const visibleCards = visibleBoard.lists.reduce(
    (acc, l) => acc + l.cards.length,
    0,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // ---- Drag logic (unchanged) ----
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
      toast.success("List added");
    }
    setNewListTitle("");
    setAddingList(false);
  };

  const listIds = visibleBoard.lists.map((l) => l.id);

  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-hidden">
      <h1 className="text-center text-2xl font-serif text-gray-800 tracking-widest uppercase mb-4">
        {board.title}
      </h1>

      {/* Search & Filter Bar */}
      <FilterBar
        query={query}
        setQuery={setQuery}
        filters={filters}
        setFilters={setFilters}
        visible={visibleCards}
        total={totalCards}
      />
      {/* Empty Search/Filter Result */}
      {visibleCards === 0 && totalCards > 0 && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm mb-4">
          <p className="text-gray-700 font-medium">
            No tasks match your search or filters
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your keywords or clearing filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilters(emptyFilters);
            }}
            className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear everything
          </button>
        </div>
      )}

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
            {visibleBoard.lists.map((list, idx) => (
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

        {/* DragOverlay */}
        <DragOverlay>
          {activeItem?.type === "card" && activeItem.data ? (
            <div className="rotate-3 cursor-grabbing">
              <TaskCard card={activeItem.data} onClick={() => {}} />
            </div>
          ) : activeItem?.type === "column" && activeItem.data ? (
            <div className="rotate-2 cursor-grabbing w-[280px]">
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
