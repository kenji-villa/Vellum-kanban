import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { api } from "../utils/api";
import { useAuth } from "./AuthContext";
import { useBoard } from "./BoardContext";
import { isCardDone } from "../utils/listStyle";
import { isSocketConnected } from "../utils/socket";

const NotificationContext = createContext();

const SEEN_KEY = "vellum_seen_alerts_v1";
const POLL_MS = 45000;
const WARN_DAYS_HIGH = 3;
const WARN_DAYS_NORMAL = 1;

// Server notification type -> how the bell renders it
const KINDS = {
  INVITE_RECEIVED: "invite",
  INVITE_ACCEPTED: "accepted",
  BOARD_SHARED: "shared",
  TASK_ASSIGNED: "assigned",
  TASK_SUBMITTED: "submitted",
  TASK_APPROVED: "approved",
  TASK_CHANGES_REQUESTED: "changes",
  COMMENT_ADDED: "commented",
};

const loadSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
};
const saveSeen = (set) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
};

const buildDeadlineItems = (boards, meId) => {
  const today = startOfDay(new Date());
  const out = [];
  for (const b of boards) {
    for (const l of b.lists) {
      for (const c of l.cards) {
        if (!c.dueDate) continue;
        // Finished or waiting on a reviewer: nothing left to warn about
        if (isCardDone(c, l) || c.status === "SUBMITTED") continue;
        // Only tasks that are yours: assigned to you, or unassigned on a board you own
        const mine = c.assigneeId ? c.assigneeId === meId : b.role === "owner";
        if (!mine) continue;
        const days = differenceInCalendarDays(new Date(c.dueDate), today);
        const limit = c.priority === "high" ? WARN_DAYS_HIGH : WARN_DAYS_NORMAL;
        if (days > limit) continue;
        const bucket = days < 0 ? "overdue" : `d${days}`;
        out.push({
          key: `due:${c.id}:${bucket}`, // changes when the task gets closer, so it re-alerts
          kind: "deadline",
          days,
          card: c,
          boardId: b.id,
          boardTitle: b.title,
          listTitle: l.title,
        });
      }
    }
  }
  return out.sort((a, b) => a.days - b.days);
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { state, refreshBoards } = useBoard();

  const [server, setServer] = useState({ notifications: [], unreadCount: 0 });
  const [seen, setSeen] = useState(loadSeen);
  const [teamVersion, setTeamVersion] = useState(0);
  const [tick, setTick] = useState(0);
  const lastTopId = useRef(null);

  const bumpTeam = useCallback(() => setTeamVersion((v) => v + 1), []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getNotifications();
      setServer(data);
      const top = data.notifications[0]?.id || "";
      // A new notification may mean something changed (a teammate accepted,
      // a board was shared with you, a task was assigned or reviewed)
      if (lastTopId.current !== null && top !== lastTopId.current) {
        bumpTeam();
        refreshBoards();
      }
      lastTopId.current = top;
    } catch {
      /* ignore polling errors */
    }
  }, [isAuthenticated, bumpTeam, refreshBoards]);

  // Poll + refresh when the tab regains focus
  useEffect(() => {
    if (!isAuthenticated) {
      setServer({ notifications: [], unreadCount: 0 });
      lastTopId.current = null;
      return;
    }
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && !isSocketConnected())
        refresh();
    }, POLL_MS);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", refresh);
    };
  }, [isAuthenticated, refresh]);

  // Recompute deadlines every 5 minutes (covers midnight rollover)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // `tick` is only here to force a recompute when the clock moves on
  const deadlines = useMemo(
    () => buildDeadlineItems(state.boards, user?.id),
    [state.boards, tick, user?.id],
  );

  // Forget "seen" keys for alerts that no longer exist
  useEffect(() => {
    if (state.loading || state.error) return;
    const live = new Set(deadlines.map((d) => d.key));
    setSeen((prev) => {
      const next = new Set([...prev].filter((k) => live.has(k)));
      if (next.size === prev.size) return prev;
      saveSeen(next);
      return next;
    });
  }, [deadlines, state.loading, state.error]);

  const items = useMemo(() => {
    const serverItems = server.notifications
      .map((n) => ({
        key: `n:${n.id}`,
        id: n.id,
        kind: KINDS[n.type], // unknown types stay undefined and are skipped below
        unread: !n.readAt,
        createdAt: n.createdAt,
        actor: n.actor,
        invitation: n.invitation,
        board: n.board,
        card: n.card,
        note: n.note,
      }))
      .filter((i) => i.kind);

    const pending = serverItems.filter(
      (i) => i.kind === "invite" && i.invitation?.status === "PENDING",
    );
    const rest = serverItems.filter((i) => !pending.includes(i));
    const deadlineItems = deadlines.map((d) => ({
      ...d,
      unread: !seen.has(d.key),
    }));
    return [...pending, ...deadlineItems, ...rest];
  }, [server, deadlines, seen]);

  const unreadCount =
    server.unreadCount +
    items.filter((i) => i.kind === "deadline" && i.unread).length;

  const markRead = async (item) => {
    if (item.kind === "deadline") {
      setSeen((prev) => {
        if (prev.has(item.key)) return prev;
        const next = new Set(prev).add(item.key);
        saveSeen(next);
        return next;
      });
      return;
    }
    if (!item.unread) return;
    setServer((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === item.id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
    try {
      await api.markNotificationRead(item.id);
    } catch {
      refresh();
    }
  };

  const markAllRead = async () => {
    setSeen((prev) => {
      const next = new Set([...prev, ...deadlines.map((d) => d.key)]);
      saveSeen(next);
      return next;
    });
    setServer((s) => ({
      notifications: s.notifications.map((n) => ({
        ...n,
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
    try {
      await api.markAllNotificationsRead();
    } catch {
      refresh();
    }
  };

  const respondToInvite = async (item, accept) => {
    const id = item.invitation.id;
    if (accept) await api.acceptInvitation(id);
    else await api.declineInvitation(id);
    await refresh();
    bumpTeam();
  };

  return (
    <NotificationContext.Provider
      value={{
        items,
        unreadCount,
        markRead,
        markAllRead,
        respondToInvite,
        refresh,
        teamVersion,
        bumpTeam,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  return ctx;
};
