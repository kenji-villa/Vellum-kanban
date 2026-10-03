import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../Card/TaskCard";
import TaskModal from "../Card/TaskModal";
import { useBoard } from "../../context/BoardContext";

const BoardColumn = ({ boardId, list, variant = "todo" }) => {
  const { dispatch } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { type: "list", listId: list.id },
  });

  const actionIcon = {
    todo: "+",
    inprogress: "…",
    done: "✓",
  }[variant];

  const handleOpenCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleSubmitCard = (formData) => {
    if (editingCard) {
      dispatch({
        type: "UPDATE_CARD",
        payload: {
          boardId,
          listId: list.id,
          cardId: editingCard.id,
          updates: formData,
        },
      });
    } else {
      dispatch({
        type: "ADD_CARD",
        payload: { boardId, listId: list.id, ...formData },
      });
    }
    setModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = () => {
    if (!editingCard) return;
    dispatch({
      type: "DELETE_CARD",
      payload: { boardId, listId: list.id, cardId: editingCard.id },
    });
    setModalOpen(false);
    setEditingCard(null);
  };

  const handleRenameList = () => {
    if (newTitle.trim() && newTitle !== list.title) {
      dispatch({
        type: "UPDATE_LIST",
        payload: { boardId, listId: list.id, title: newTitle.trim() },
      });
    }
    setRenaming(false);
  };

  const handleDeleteList = () => {
    if (window.confirm(`Delete list "${list.title}" and all its cards?`)) {
      dispatch({
        type: "DELETE_LIST",
        payload: { boardId, listId: list.id },
      });
    }
    setListMenuOpen(false);
  };

  const cardIds = list.cards.map((c) => c.id);

  return (
    <>
      <div className="flex-1 min-w-[280px] flex flex-col">
        {/* Column Header */}
        <div className="bg-[#1e2757] text-white rounded-t-xl px-4 py-3 flex items-center justify-between relative">
          {renaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === "Enter" && handleRenameList()}
              autoFocus
              className="bg-transparent text-white font-semibold text-sm outline-none border-b border-white/40 w-full"
            />
          ) : (
            <h2 className="font-semibold text-sm tracking-wide">
              {list.title}
            </h2>
          )}

          <button
            onClick={
              variant === "todo"
                ? handleOpenCreate
                : () => setListMenuOpen((v) => !v)
            }
            className="text-white/70 hover:text-white text-lg leading-none ml-2"
          >
            {variant === "todo" ? "+" : actionIcon}
          </button>

          {listMenuOpen && (
            <div className="absolute top-full right-2 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-36 z-20">
              <button
                onClick={() => {
                  setRenaming(true);
                  setListMenuOpen(false);
                }}
                className="block w-full text-left text-sm text-gray-700 px-3 py-1.5 hover:bg-gray-100"
              >
                Rename
              </button>
              <button
                onClick={handleDeleteList}
                className="block w-full text-left text-sm text-red-600 px-3 py-1.5 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Droppable Cards Area */}
        <div
          ref={setNodeRef}
          className={`rounded-b-xl p-3 flex flex-col gap-3 flex-1 min-h-[500px] transition-colors ${
            isOver ? "bg-blue-100/60" : "bg-gray-200/50"
          }`}
        >
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <TaskCard
                key={card.id}
                card={card}
                onClick={() => handleOpenEdit(card)}
              />
            ))}
          </SortableContext>

          {list.cards.length === 0 && (
            <div className="text-center text-xs text-gray-400 py-6">
              Drop a card here
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCard(null);
        }}
        card={editingCard}
        onSubmit={handleSubmitCard}
        onDelete={handleDeleteCard}
      />
    </>
  );
};

export default BoardColumn;
