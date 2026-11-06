import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../context/NotificationContext";
import { useToast } from "../../context/ToastContext";
import PersonAvatar from "../Team/PersonAvatar";

const TABS = [
  { id: "all", label: "All" },
  { id: "invites", label: "Activity" },
  { id: "deadlines", label: "Deadlines" },
];

const ACTIVITY_KINDS = new Set([
  "shared",
  "assigned",
  "submitted",
  "approved",
  "changes",
]);

const dueLabel = (days) => {
  if (days < 0) return `Overdue by ${-days} day${days < -1 ? "s" : ""}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
};

const tone = (days) =>
  days < 0
    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    : days === 0
      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

const UnreadDot = () => (
  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
);

const DeadlineItem = ({ item, onOpen }) => (
  <li>
    <button
      onClick={() => onOpen(item)}
      className="relative w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      {item.unread && <UnreadDot />}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone(item.days)}`}
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
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {item.card.title}
        </p>
        <p className="text-[11px] text-gray-400 truncate">
          {item.boardTitle} · {item.listTitle}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tone(item.days)}`}
          >
            {dueLabel(item.days)}
          </span>
          {item.card.priority === "high" && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 dark:bg-red-900/20">
              High priority
            </span>
          )}
        </div>
      </div>
    </button>
  </li>
);

const InviteItem = ({ item, onRespond, busy }) => {
  const status = item.invitation?.status;
  return (
    <li className="relative flex gap-3 px-4 py-3">
      {item.unread && <UnreadDot />}
      <PersonAvatar user={item.actor} size={40} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
          <span className="font-semibold">{item.actor?.name}</span> invited you
          to join their team
        </p>
        {item.invitation?.message && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 line-clamp-2">
            “{item.invitation.message}”
          </p>
        )}
        <p className="text-[11px] text-gray-400 mt-0.5">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </p>
        {status === "PENDING" ? (
          <div className="flex gap-2 mt-2">
            <button
              disabled={busy}
              onClick={() => onRespond(item, true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60"
            >
              Accept
            </button>
            <button
              disabled={busy}
              onClick={() => onRespond(item, false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 disabled:opacity-60"
            >
              Decline
            </button>
          </div>
        ) : (
          <p className="text-[11px] font-medium text-gray-400 mt-1.5">
            {status === "ACCEPTED"
              ? "✓ You're teammates"
              : status === "DECLINED"
                ? "Declined"
                : "No longer available"}
          </p>
        )}
      </div>
    </li>
  );
};

const AcceptedItem = ({ item, onOpen }) => (
  <li>
    <button
      onClick={() => onOpen(item)}
      className="relative w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      {item.unread && <UnreadDot />}
      <div className="relative">
        <PersonAvatar user={item.actor} size={40} />
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-800">
          <svg viewBox="0 0 16 16" className="w-2.5 h-2.5">
            <path
              d="M3.5 8.4l2.7 2.7 6-6.4"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
          <span className="font-semibold">{item.actor?.name}</span> accepted
          your invitation 🎉
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </p>
      </div>
    </button>
  </li>
);

const ACTIVITY_TEXT = {
  shared: (i) => ({
    verb: "shared the board ",
    subject: i.board?.title,
    tail: " with you",
  }),
  assigned: (i) => ({ verb: "assigned you ", subject: i.card?.title }),
  submitted: (i) => ({
    verb: "submitted ",
    subject: i.card?.title,
    tail: " for review",
  }),
  approved: (i) => ({
    verb: "marked ",
    subject: i.card?.title,
    tail: " as done ✓",
  }),
  changes: (i) => ({ verb: "requested changes on ", subject: i.card?.title }),
};

const ActivityItem = ({ item, onOpen }) => {
  const t = ACTIVITY_TEXT[item.kind](item);
  return (
    <li>
      <button
        onClick={() => onOpen(item)}
        className="relative w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        {item.unread && <UnreadDot />}
        <PersonAvatar user={item.actor} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
            <span className="font-semibold">{item.actor?.name}</span> {t.verb}
            <span className="font-semibold">{t.subject}</span>
            {t.tail || ""}
          </p>
          {item.kind !== "shared" && item.board && (
            <p className="text-[11px] text-gray-400 truncate">
              {item.board.title}
            </p>
          )}
          {item.note && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 line-clamp-2">
              “{item.note}”
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-0.5">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>
        </div>
      </button>
    </li>
  );
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, unreadCount, markRead, markAllRead, respondToInvite } =
    useNotifications();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [busyKey, setBusyKey] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const visible = items.filter((i) =>
    tab === "all"
      ? true
      : tab === "deadlines"
        ? i.kind === "deadline"
        : i.kind !== "deadline",
  );
  const unreadBy = {
    invites: items.filter((i) => i.kind !== "deadline" && i.unread).length,
    deadlines: items.filter((i) => i.kind === "deadline" && i.unread).length,
  };

  const handleOpen = (item) => {
    markRead(item);
    setOpen(false);
    if (item.kind === "deadline") navigate(`/board/${item.boardId}`);
    else if (ACTIVITY_KINDS.has(item.kind) && item.board)
      navigate(`/board/${item.board.id}`);
    else navigate("/team");
  };

  const handleRespond = async (item, accept) => {
    setBusyKey(item.key);
    try {
      await respondToInvite(item, accept);
      toast.success(
        accept
          ? `You and ${item.actor?.name} are now teammates`
          : "Invitation declined",
      );
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        aria-label="Notifications"
        className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
          open
            ? "bg-white/10 text-white"
            : "text-white/60 hover:bg-white/10 hover:text-white"
        }`}
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
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#1e2757]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-3 w-[22rem] max-h-[70vh] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3.5 flex items-center justify-between text-white bg-gradient-to-r from-[#1e2757] to-[#2a3572]">
            <div>
              <h3 className="text-sm font-semibold">Notifications</h3>
              <p className="text-[11px] text-white/60">
                {unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium text-white/80 hover:text-white underline underline-offset-2"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-3 pt-2 border-b border-gray-100 dark:border-slate-700">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-2 text-xs font-medium transition-colors ${
                  tab === t.id
                    ? "text-[var(--accent)]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {t.label}
                {unreadBy[t.id] > 0 && (
                  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    {unreadBy[t.id]}
                  </span>
                )}
                {tab === t.id && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {visible.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3 text-xl">
                  🎉
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  You're all caught up
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Invitations, assignments and deadline alerts will show up
                  here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {visible.map((item) =>
                  item.kind === "deadline" ? (
                    <DeadlineItem
                      key={item.key}
                      item={item}
                      onOpen={handleOpen}
                    />
                  ) : item.kind === "invite" ? (
                    <InviteItem
                      key={item.key}
                      item={item}
                      onRespond={handleRespond}
                      busy={busyKey === item.key}
                    />
                  ) : item.kind === "shared" || item.kind === "assigned" ? (
                    <ActivityItem
                      key={item.key}
                      item={item}
                      onOpen={handleOpen}
                    />
                  ) : (
                    <AcceptedItem
                      key={item.key}
                      item={item}
                      onOpen={handleOpen}
                    />
                  ),
                )}
              </ul>
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/team");
            }}
            className="px-4 py-2.5 text-xs font-medium text-[var(--accent)] hover:bg-gray-50 dark:hover:bg-slate-700/50 border-t border-gray-100 dark:border-slate-700"
          >
            Manage your team →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
