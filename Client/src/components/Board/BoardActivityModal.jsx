import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Modal from "../UI/Modal";
import PersonAvatar from "../Team/PersonAvatar";
import { api } from "../../utils/api";
import { describeActivity } from "../../utils/activityText";

const BoardActivityModal = ({ isOpen, onClose, boardId }) => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initial fetch when opened
    setItems(null);
    api
      .getBoardActivity(boardId)
      .then(({ activity }) => setItems(activity))
      .catch(() => setItems([]));

    // Listen for live updates on this board
    const onChange = (e) => {
      if (e.detail?.boardId !== boardId) return;
      api
        .getBoardActivity(boardId)
        .then(({ activity }) => setItems(activity))
        .catch(() => {});
    };

    window.addEventListener("vellum:board-changed", onChange);
    return () => window.removeEventListener("vellum:board-changed", onChange);
  }, [isOpen, boardId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Board activity">
      {items === null ? (
        <div className="h-40 rounded-xl bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">
          Nothing has happened on this board yet.
        </p>
      ) : (
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((a) => (
            <li key={a.id} className="flex gap-3">
              <PersonAvatar user={a.actor} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
                  <span className="font-semibold">
                    {a.actor?.name || "Someone"}
                  </span>{" "}
                  {describeActivity(a, `“${a.cardTitle || "a task"}”`)}
                </p>
                {a.body && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
                    “{a.body}”
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {formatDistanceToNow(new Date(a.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default BoardActivityModal;
