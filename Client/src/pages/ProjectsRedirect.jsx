import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useBoard } from "../context/BoardContext";
import { useToast } from "../context/ToastContext";

const Shell = ({ children }) => (
  <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
    <Sidebar />
    <div className="flex-1 flex items-center justify-center p-8">
      {children}
    </div>
  </div>
);

const MiniColumn = ({ title, cards }) => (
  <div className="w-24 rounded-xl bg-gray-100 dark:bg-slate-700/60 p-2 space-y-2">
    <p className="px-1 text-[9px] font-semibold uppercase tracking-wide text-gray-400">
      {title}
    </p>
    {Array.from({ length: cards }).map((_, i) => (
      <div
        key={i}
        className="h-7 rounded-md bg-white dark:bg-slate-600 shadow-sm"
      />
    ))}
  </div>
);

const ProjectsRedirect = () => {
  const { state, createBoard, reloadBoards } = useBoard();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  if (state.loading) {
    return (
      <Shell>
        <p className="text-sm text-gray-500">Loading projects…</p>
      </Shell>
    );
  }

  // A failed load also leaves boards empty, so don't call that "no boards"
  if (state.error && state.boards.length === 0) {
    return (
      <Shell>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Couldn't load your boards
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-4">{state.error}</p>
          <button
            onClick={reloadBoards}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
          >
            Try again
          </button>
        </div>
      </Shell>
    );
  }

  // Has boards: go to the first one
  if (state.boards.length > 0) {
    return <Navigate to={`/board/${state.boards[0].id}`} replace />;
  }

  // No boards: onboarding
  const handleCreate = async (e) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) return toast.error("Give your board a name");
    setCreating(true);
    try {
      await createBoard(name);
      toast.success("Board created");
      // boards is no longer empty, so the redirect above opens it
    } catch (err) {
      toast.error(err.message || "Failed to create board");
      setCreating(false);
    }
  };

  return (
    <Shell>
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center gap-3 mb-8" aria-hidden="true">
          <MiniColumn title="To Do" cards={3} />
          <MiniColumn title="In Progress" cards={2} />
          <MiniColumn title="Done" cards={1} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create your first board
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
          Boards are where your tasks live. Yours will start with To Do, In
          Progress and Done, and you can change them anytime.
        </p>

        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Website redesign"
            autoFocus
            disabled={creating}
            className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60"
          >
            {creating ? "Creating…" : "Create board"}
          </button>
        </form>
      </div>
    </Shell>
  );
};

export default ProjectsRedirect;
