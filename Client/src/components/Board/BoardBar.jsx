import React, { useState } from "react";
import { FiUserPlus, FiActivity } from "react-icons/fi";
import PersonAvatar from "../Team/PersonAvatar";
import ShareBoardModal from "./ShareBoardModal";
import BoardActivityModal from "./BoardActivityModal";
import { useBoardPeople } from "../../hooks/useBoardPeople";

const BoardBar = ({ board }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const people = useBoardPeople(board.id);
  const isOwner = board.role === "owner";
  const shown = people.slice(0, 5);
  const extra = people.length - shown.length;

  return (
    <div className="px-8 pt-4 flex items-center justify-end gap-4">
      {!isOwner && (
        <div className="mr-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {board.owner?.name && (
            <span>
              Shared by{" "}
              <span className="font-semibold">{board.owner.name}</span>
            </span>
          )}
          {board.role === "viewer" && (
            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-200 font-semibold">
              View only
            </span>
          )}
        </div>
      )}

      <div className="flex -space-x-2">
        {shown.map((p) => (
          <span key={p.id} title={p.name}>
            <PersonAvatar user={p} size={32} ring />
          </span>
        ))}
        {extra > 0 && (
          <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-200 ring-4 ring-white dark:ring-slate-800 text-[11px] font-bold flex items-center justify-center">
            +{extra}
          </span>
        )}
      </div>

      <button
        onClick={() => setActivityOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm"
      >
        <FiActivity className="w-4 h-4" />
        Activity
      </button>

      <button
        onClick={() => setShareOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm"
      >
        <FiUserPlus className="w-4 h-4" />
        Share
      </button>

      <ShareBoardModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        board={board}
      />
      <BoardActivityModal
        isOpen={activityOpen}
        onClose={() => setActivityOpen(false)}
        boardId={board.id}
      />
    </div>
  );
};

export default BoardBar;
