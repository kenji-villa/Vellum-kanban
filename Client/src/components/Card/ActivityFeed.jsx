import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { api } from "../../utils/api";
import { useBoard } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import PersonAvatar from "../Team/PersonAvatar";
import { ACTIVITY_ICON, describeActivity } from "../../utils/activityText";

const ago = (d) => formatDistanceToNow(new Date(d), { addSuffix: true });

const ActivityFeed = ({
  cardId,
  boardId,
  listId,
  me,
  canComment,
  canModerate,
}) => {
  const toast = useToast();
  const { patchCardLocal } = useBoard();
  const [items, setItems] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  // Fetch activity on mount or when cardId changes
  useEffect(() => {
    let cancelled = false;
    setItems(null);
    api
      .getCardActivity(cardId)
      .then(({ activity }) => {
        if (!cancelled) setItems(activity);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  useEffect(() => {
    const onChange = (e) => {
      if (e.detail?.cardId !== cardId) return;
      api
        .getCardActivity(cardId)
        .then(({ activity }) => setItems(activity))
        .catch(() => {});
    };
    window.addEventListener("vellum:board-changed", onChange);
    return () => window.removeEventListener("vellum:board-changed", onChange);
  }, [cardId]);

  // Keep the newest entry in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items?.length]);

  const send = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      const { activity, commentCount } = await api.addComment(cardId, body);
      setItems((prev) => [...(prev || []), activity]);
      patchCardLocal(boardId, listId, cardId, { comments: commentCount });
      setText("");
    } catch (err) {
      toast.error(err.message || "Couldn't post comment");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const { commentCount } = await api.deleteComment(cardId, a.id);
      setItems((prev) => prev.filter((x) => x.id !== a.id));
      patchCardLocal(boardId, listId, cardId, { comments: commentCount });
    } catch (err) {
      toast.error(err.message || "Couldn't delete comment");
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-800 mb-3">Activity</h3>

      {canComment ? (
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 1000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Write a comment…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-gray-400">
              Ctrl + Enter to send
            </span>
            <button
              type="button"
              onClick={send}
              disabled={busy || !text.trim()}
              className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
            >
              {busy ? "Posting…" : "Comment"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mb-4">
          You have view-only access, so you can read comments but not add them.
        </p>
      )}

      {items === null ? (
        <div className="h-16 rounded-lg bg-gray-100 animate-pulse" />
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400">No activity yet.</p>
      ) : (
        <ul ref={listRef} className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {items.map((a) =>
            a.type === "COMMENT" ? (
              <li key={a.id} className="flex gap-3">
                <PersonAvatar user={a.actor} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {a.actor?.name || "Someone"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {ago(a.createdAt)}
                    </span>
                    {(a.actor?.id === me || canModerate) && canComment && (
                      <button
                        type="button"
                        onClick={() => remove(a)}
                        className="ml-auto text-[11px] text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words bg-gray-50 rounded-lg px-3 py-2">
                    {a.body}
                  </p>
                </div>
              </li>
            ) : (
              <li
                key={a.id}
                className="flex items-start gap-3 text-xs text-gray-500"
              >
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">
                  {ACTIVITY_ICON[a.type] || "•"}
                </span>
                <p className="pt-1.5 leading-snug">
                  <span className="font-semibold text-gray-700">
                    {a.actor?.name || "Someone"}
                  </span>{" "}
                  {describeActivity(a)}
                  {a.body ? ` — “${a.body}”` : ""}{" "}
                  <span className="text-gray-400">· {ago(a.createdAt)}</span>
                </p>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;
