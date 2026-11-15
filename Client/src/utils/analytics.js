import {
  differenceInCalendarDays,
  format,
  isSameWeek,
  parseISO,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { getListMeta, isCardDone } from "./listStyle";
import { labelKey } from "./labels";

// done | review | progress | todo
export const categoryOf = (card, list) => {
  if (isCardDone(card, list)) return "done";
  if (card.status === "SUBMITTED") return "review";
  return getListMeta(list.title).kind === "progress" ? "progress" : "todo";
};

export const buildTasks = (boards, { boardId = "all", mineOnly = false, meId } = {}) => {
  const today = startOfDay(new Date());
  const out = [];
  for (const board of boards) {
    if (boardId !== "all" && board.id !== boardId) continue;
    for (const list of board.lists) {
      for (const card of list.cards) {
        if (mineOnly && card.assigneeId !== meId) continue;
        const category = categoryOf(card, list);
        const days = card.dueDate ? differenceInCalendarDays(parseISO(card.dueDate), today) : null;
        out.push({
          card,
          board,
          list,
          category,
          days,
          overdue: days !== null && days < 0 && category !== "done",
          // Done tasks without a recorded completion time use their last update
          completedAt: category === "done" ? card.completedAt || card.updatedAt || null : null,
        });
      }
    }
  }
  return out;
};

// id -> person, from every board's owner and members (plus you)
export const buildPeople = (boards, me) => {
  const map = new Map();
  if (me?.id) {
    map.set(me.id, { id: me.id, name: me.name, title: me.title, avatarUrl: me.avatarUrl });
  }
  for (const b of boards) {
    if (b.owner?.name) map.set(b.owner.id, b.owner);
    (b.members || []).forEach((p) => map.set(p.id, p));
  }
  return map;
};

export const weeklyThroughput = (tasks, weeks = 8) => {
  const now = new Date();
  const buckets = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    buckets.push({ start, label: format(start, "MMM d"), created: 0, completed: 0 });
  }
  const put = (iso, key) => {
    if (!iso) return;
    const d = new Date(iso);
    const b = buckets.find((x) => isSameWeek(d, x.start, { weekStartsOn: 1 }));
    if (b) b[key] += 1;
  };
  for (const t of tasks) {
    put(t.card.createdAt, "created");
    put(t.completedAt, "completed");
  }
  return buckets;
};

export const workload = (tasks, people) => {
  const map = new Map();
  for (const t of tasks) {
    if (t.category === "done") continue;
    const id = t.card.assigneeId || (t.card.assignee ? `name:${t.card.assignee}` : "none");
    const person = t.card.assigneeId ? people.get(t.card.assigneeId) : null;
    const entry = map.get(id) || {
      id,
      name: person?.name || t.card.assignee || "Unassigned",
      person: person || null,
      open: 0,
      overdue: 0,
    };
    entry.open += 1;
    if (t.overdue) entry.overdue += 1;
    map.set(id, entry);
  }
  return [...map.values()].sort((a, b) => b.open - a.open);
};

export const needsAttention = (tasks, limit = 6) =>
  tasks
    .filter((t) => t.category !== "done" && t.days !== null && t.days <= 3)
    .sort((a, b) => a.days - b.days)
    .slice(0, limit);

export const boardStats = (tasks, boards, boardId) =>
  boards
    .filter((b) => boardId === "all" || b.id === boardId)
    .map((board) => {
      const mine = tasks.filter((t) => t.board.id === board.id);
      const done = mine.filter((t) => t.category === "done").length;
      return {
        board,
        total: mine.length,
        done,
        overdue: mine.filter((t) => t.overdue).length,
        review: mine.filter((t) => t.category === "review").length,
        pct: mine.length ? Math.round((done / mine.length) * 100) : 0,
      };
    });

export const labelStats = (tasks, boards) => {
  const allLabels = boards.flatMap((b) => b.labels || []);
  const counts = {};
  for (const t of tasks) {
    for (const l of t.card.labels || []) counts[l] = (counts[l] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, key: labelKey(label, allLabels) }))
    .sort((a, b) => b.count - a.count);
};