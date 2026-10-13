import React, { useState } from "react";
import ConfirmDialog from "../UI/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // --- Column Sortable (for reordering columns) ---
  const {
    attributes: colAttributes,
    listeners: colListeners,
    setNodeRef: setColumnRef,
    transform: colTransform,
    transition: colTransition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: list.id,
    data: { type: "column", listId: list.id },
  });

  // --- Column Droppable (for dropping cards) ---
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${list.id}`,
    data: { type: "list", listId: list.id },
  });

  const columnStyle = {
    transform: CSS.Transform.toString(colTransform),
    transition: colTransition,
    opacity: isColumnDragging ? 0.5 : 1,
  };

  const actionIcon = {
    todo: "+",
    inprogress: "…",
    done: "✓",
  }[variant];

  // --- Card Handlers ---
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
      toast.success("Task updated");
    } else {
      dispatch({
        type: "ADD_CARD",
        payload: { boardId, listId: list.id, ...formData },
      });
      toast.success("Task created");
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
    toast.info("Task deleted");
    setModalOpen(false);
    setEditingCard(null);
  };

  // --- List Handlers ---
  const handleRenameList = () => {
    if (newTitle.trim() && newTitle !== list.title) {
      dispatch({
        type: "UPDATE_LIST",
        payload: { boardId, listId: list.id, title: newTitle.trim() },
      });
      toast.success("List renamed");
    }
    setRenaming(false);
  };

  const handleDeleteList = () => {
    setConfirmOpen(true);
    setListMenuOpen(false);
  };

  const confirmDeleteList = () => {
    dispatch({
      type: "DELETE_LIST",
      payload: { boardId, listId: list.id },
    });
    toast.info(`List "${list.title}" deleted`);
  };

  const cardIds = list.cards.map((c) => c.id);

  return (
    <>
      <div
        ref={setColumnRef}
        style={columnStyle}
        className="flex-1 min-w-[280px] max-w-[320px] flex flex-col"
      >
        {/* Column Header — Drag Handle */}
        <div
          {...colAttributes}
          {...colListeners}
          className="bg-[#1e2757] text-white rounded-t-xl px-4 py-3 flex items-center justify-between relative cursor-grab active:cursor-grabbing"
        >
          {renaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === "Enter" && handleRenameList()}
              autoFocus
              onPointerDown={(e) => e.stopPropagation()} // don't start drag while typing
              className="bg-transparent text-white font-semibold text-sm outline-none border-b border-white/40 w-full"
            />
          ) : (
            <h2 className="font-semibold text-sm tracking-wide">
              {list.title}
            </h2>
          )}

          <button
            onPointerDown={(e) => e.stopPropagation()} // don't start drag from the button
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

        {/* Cards Droppable Area */}
        <div
          ref={setDroppableRef}
          className={`rounded-b-xl p-3 flex flex-col gap-3 flex-1 min-h-[500px] transition-colors ${
            isOver
              ? "bg-blue-100/60 dark:bg-blue-900/30"
              : "bg-gray-200/50 dark:bg-slate-800/50"
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
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteList}
        title="Delete list?"
        message={`Delete "${list.title}" and all its cards? This cannot be undone.`}
        confirmText="Delete List"
      />
    </>
  );
};

export default BoardColumn;
