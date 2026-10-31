import React, { useEffect, useRef, useState } from "react";
import ConfirmDialog from "../UI/ConfirmDialog";
import { useToast } from "../../context/ToastContext";
import { useDroppable } from "@dnd-kit/core";
import ListIcon from "./ListIcon";
import { getListMeta } from "../../utils/listStyle";

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

const BoardColumn = ({ boardId, list, index = 0 }) => {
  const { updateCard, deleteCard, createCard, updateList, deleteList } =
    useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const meta = getListMeta(list.title, index);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!listMenuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setListMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [listMenuOpen]);

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

  // --- Card Handlers ---
  const handleOpenCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setModalOpen(true);
  };
  const handleSubmitCard = async (formData) => {
    try {
      if (editingCard) {
        await updateCard(boardId, list.id, editingCard.id, formData);
        toast.success("Task updated");
      } else {
        await createCard(boardId, list.id, formData);
        toast.success("Task created");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save task");
    }
    setModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = async () => {
    if (!editingCard) return;
    try {
      await deleteCard(boardId, list.id, editingCard.id);
      toast.info("Task deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
    setModalOpen(false);
    setEditingCard(null);
  };

  // --- List Handlers ---
  const handleRenameList = async () => {
    if (newTitle.trim() && newTitle !== list.title) {
      try {
        await updateList(boardId, list.id, newTitle.trim());
        toast.success("List renamed");
      } catch (err) {
        toast.error(err.message || "Failed to rename");
      }
    }
    setRenaming(false);
  };

  const handleDeleteList = () => {
    setConfirmOpen(true);
    setListMenuOpen(false);
  };

  const confirmDeleteList = async () => {
    try {
      await deleteList(boardId, list.id);
      toast.info(`List "${list.title}" deleted`);
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
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
        {/* Column Header — Drag Handle */}
        <div
          {...colAttributes}
          {...colListeners}
          style={{ borderTopColor: meta.color }}
          className="bg-[#1e2757] text-white rounded-t-xl border-t-4 px-4 py-3 flex items-center gap-2 relative cursor-grab active:cursor-grabbing"
        >
          <ListIcon kind={meta.kind} color={meta.color} />

          {renaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRenameList}
              onKeyDown={(e) => e.key === "Enter" && handleRenameList()}
              autoFocus
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-transparent text-white font-semibold text-sm outline-none border-b border-white/40 flex-1 min-w-0"
            />
          ) : (
            <h2 className="font-semibold text-sm tracking-wide truncate">
              {list.title}
            </h2>
          )}

          <span className="text-[11px] font-medium bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
            {list.cards.length}
          </span>

          <div
            ref={menuRef}
            className="ml-auto relative flex items-center gap-1"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleOpenCreate}
              title="Add task"
              className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-lg leading-none"
            >
              +
            </button>
            <button
              onClick={() => setListMenuOpen((v) => !v)}
              title="List options"
              className="w-7 h-7 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-lg leading-none"
            >
              ⋯
            </button>

            {listMenuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 w-36 z-20">
                <button
                  onClick={() => {
                    setRenaming(true);
                    setListMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 dark:text-gray-200 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Rename
                </button>
                <button
                  onClick={handleDeleteList}
                  className="block w-full text-left text-sm text-red-600 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
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
