import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMatch, useNavigate } from "react-router-dom";
import Modal from "./UI/Modal";
import { useBoard } from "../context/BoardContext";
import { useToast } from "../context/ToastContext";
import { useSettings } from "../context/SettingsContext";

const fieldClass =
  "w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]";
const labelClass =
  "block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1";

const MenuItem = ({ title, hint, onClick }) => (
  <button
    role="menuitem"
    onClick={onClick}
    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
  >
    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
      {title}
    </p>
    <p className="text-[11px] text-gray-400">{hint}</p>
  </button>
);

const QuickCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { settings } = useSettings();
  const { state, createBoard, createCard } = useBoard();
  const currentBoardId = useMatch("/board/:boardId")?.params.boardId;

  const wrapRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [busy, setBusy] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [boardId, setBoardId] = useState("");
  const [listId, setListId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [boardTitle, setBoardTitle] = useState("");

  const hasBoards = state.boards.length > 0;
  const selectedBoard = state.boards.find((b) => b.id === boardId);
  const lists = selectedBoard?.lists ?? [];

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeModal = () => {
    if (!busy) setMode(null);
  };

  const openTask = () => {
    const board =
      state.boards.find((b) => b.id === currentBoardId) || state.boards[0];
    setBoardId(board.id);
    setListId(board.lists[0]?.id || "");
    setPriority(settings.defaultPriority || "medium");
    setTaskTitle("");
    setMenuOpen(false);
    setMode("task");
  };

  const openBoard = () => {
    setBoardTitle("");
    setMenuOpen(false);
    setMode("board");
  };

  // No boards: skip the menu, a task has nowhere to go
  const handleClick = () => {
    if (!hasBoards) return openBoard();
    setMenuOpen((o) => !o);
  };

  const handleBoardChange = (id) => {
    setBoardId(id);
    setListId(state.boards.find((b) => b.id === id)?.lists[0]?.id || "");
  };

  const submitTask = async () => {
    const title = taskTitle.trim();
    if (!title) return toast.error("Give the task a title");
    if (!listId) return toast.error("Pick a list first");
    setBusy(true);
    try {
      await createCard(boardId, listId, { title, priority });
      const listName = lists.find((l) => l.id === listId)?.title;
      toast.success(`Task added to ${listName}`);
      setMode(null);
    } catch (err) {
      toast.error(err.message || "Failed to add task");
    } finally {
      setBusy(false);
    }
  };

  const submitBoard = async () => {
    const title = boardTitle.trim();
    if (!title) return toast.error("Give your board a name");
    setBusy(true);
    try {
      const board = await createBoard(title);
      toast.success("Board created");
      setMode(null);
      navigate(`/board/${board.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create board");
    } finally {
      setBusy(false);
    }
  };

  const primaryBtn =
    "px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60";
  const cancelBtn =
    "px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 disabled:opacity-60";

  return (
    <>
      <div ref={wrapRef} className="relative">
        <button
          onClick={handleClick}
          disabled={state.loading}
          title="Create"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute left-full top-0 ml-3 w-52 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-1.5"
          >
            <MenuItem
              title="New task"
              hint="Add a card to a list"
              onClick={openTask}
            />
            <MenuItem
              title="New board"
              hint="Start a fresh workspace"
              onClick={openBoard}
            />
          </div>
        )}
      </div>

      {createPortal(
        <>
          <Modal isOpen={mode === "task"} onClose={closeModal} title="New task">
            <div className="space-y-4">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !busy) submitTask();
                }}
                placeholder="What needs to be done?"
                autoFocus
                disabled={busy}
                className={fieldClass}
              />

              <div>
                <label className={labelClass}>Board</label>
                <select
                  value={boardId}
                  onChange={(e) => handleBoardChange(e.target.value)}
                  className={fieldClass}
                >
                  {state.boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>List</label>
                  <select
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    disabled={lists.length === 0}
                    className={fieldClass}
                  >
                    {lists.length === 0 && <option value="">No lists</option>}
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {lists.length === 0 && (
                <p className="text-xs text-gray-400">
                  This board has no lists yet. Add one on the board first.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  onClick={closeModal}
                  disabled={busy}
                  className={cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={submitTask}
                  disabled={busy || !listId}
                  className={primaryBtn}
                >
                  {busy ? "Adding…" : "Add task"}
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={mode === "board"}
            onClose={closeModal}
            title="Create new board"
          >
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !busy) submitBoard();
              }}
              placeholder="Board name..."
              autoFocus
              disabled={busy}
              className={`${fieldClass} mb-4`}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={busy}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={submitBoard}
                disabled={busy}
                className={primaryBtn}
              >
                {busy ? "Creating…" : "Create board"}
              </button>
            </div>
          </Modal>
        </>,
        document.body,
      )}
    </>
  );
};

export default QuickCreate;
