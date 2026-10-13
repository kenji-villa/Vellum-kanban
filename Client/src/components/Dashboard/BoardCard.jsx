import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoard } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import ConfirmDialog from "../UI/ConfirmDialog";

const BoardCard = ({ board }) => {
  const navigate = useNavigate();
  const { dispatch } = useBoard();
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Focus the input when entering rename mode
  useEffect(() => {
    if (renaming) {
      setTitle(board.title);
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [renaming, board.title]);

  const handleRename = () => {
    if (title.trim() && title.trim() !== board.title) {
      dispatch({
        type: "RENAME_BOARD",
        payload: { boardId: board.id, title: title.trim() },
      });
      toast.success("Board renamed");
    }
    setRenaming(false);
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_BOARD",
      payload: { boardId: board.id },
    });
    toast.info(`Board "${board.title}" deleted`);
  };

  const handleCardClick = () => {
    if (renaming || menuOpen) return;
    navigate(`/board/${board.id}`);
  };

  const totalCards = board.lists.reduce((acc, l) => acc + l.cards.length, 0);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="relative bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-700 cursor-pointer group"
      >
        {/* Top Row: Title / Rename Input + Menu */}
        <div className="flex items-start justify-between gap-2 mb-1">
          {renaming ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 font-semibold text-gray-800 dark:text-gray-100 bg-transparent border-b border-blue-500 outline-none text-sm"
            />
          ) : (
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">
              {board.title}
            </h3>
          )}

          {/* Three-dots menu */}
          <div
            ref={menuRef}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Board options"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zM14 12a2 2 0 11-4 0 2 2 0 014 0zM22 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 py-1 w-32 z-20">
                <button
                  onClick={() => {
                    setRenaming(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm text-gray-700 dark:text-gray-200 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm text-red-600 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {board.lists.length} lists · {totalCards} cards
        </p>
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete board?"
        message={`Delete "${board.title}" and all its lists and cards? This cannot be undone.`}
        confirmText="Delete Board"
      />
    </>
  );
};

export default BoardCard;
