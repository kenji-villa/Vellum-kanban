import React, { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import PersonAvatar from "../Team/PersonAvatar";
import ShareBoardModal from "./ShareBoardModal";
import { useBoardPeople } from "../../hooks/useBoardPeople";

const BoardBar = ({ board }) => {
  const [open, setOpen] = useState(false);
  const people = useBoardPeople(board.id);
  const isOwner = board.role !== "member";
  const shown = people.slice(0, 5);
  const extra = people.length - shown.length;

  return (
    <div className="px-8 pt-4 flex items-center justify-end gap-4">
      {!isOwner && board.owner?.name && (
        <p className="mr-auto text-xs text-gray-500 dark:text-gray-400">
          Shared by <span className="font-semibold">{board.owner.name}</span>
        </p>
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
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm"
      >
        <FiUserPlus className="w-4 h-4" />
        Share
      </button>

      <ShareBoardModal
        isOpen={open}
        onClose={() => setOpen(false)}
        board={board}
      />
    </div>
  );
};

export default BoardBar;
