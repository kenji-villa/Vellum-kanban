import { differenceInCalendarDays, startOfDay } from "date-fns";
import { isCardDone } from "./listStyle";

// "@me #bug due:today is:overdue some words" -> filters + free-text words
export const parseQuery = (raw) => {
  const filters = { me: false, assignee: [], labels: [], due: null, status: null, priority: null };
  const words = [];
  for (const token of raw.trim().split(/\s+/).filter(Boolean)) {
    const t = token.toLowerCase();
    if (t === "@me") filters.me = true;
    else if (t.startsWith("@") && t.length > 1) filters.assignee.push(t.slice(1));
    else if (t.startsWith("#") && t.length > 1) filters.labels.push(t.slice(1));
    else if (t.startsWith("due:") && t.length > 4) filters.due = t.slice(4);
    else if (t.startsWith("is:") && t.length > 3) filters.status = t.slice(3);
    else if (/^(priority|p):./.test(t)) filters.priority = t.split(":")[1];
    else words.push(t);
  }
  const hasFilters = !!(
    filters.me ||
    filters.assignee.length ||
    filters.labels.length ||
    filters.due ||
    filters.status ||
    filters.priority
  );
  return { filters, words, hasFilters, empty: !raw.trim() };
};

export const statusOf = (card, list) =>
  isCardDone(card, list) ? "done" : card.status === "SUBMITTED" ? "review" : "open";

export const searchBoards = (boards, parsed) => {
  if (parsed.hasFilters || !parsed.words.length) return [];
  return boards
    .filter((b) => parsed.words.every((w) => b.title.toLowerCase().includes(w)))
    .slice(0, 5);
};

export const searchTasks = (boards, parsed, meId, limit = 30) => {
  const today = startOfDay(new Date());
  const f = parsed.filters;
  const out = [];

  for (const board of boards) {
    for (const list of board.lists) {
      for (const card of list.cards) {
        const status = statusOf(card, list);
        const days = card.dueDate
          ? differenceInCalendarDays(new Date(card.dueDate), today)
          : null;

        if (f.me && card.assigneeId !== meId) continue;
        if (
          f.assignee.length &&
          !f.assignee.every((a) => (card.assignee || "").toLowerCase().includes(a))
        )
          continue;
        if (
          f.labels.length &&
          !f.labels.every((x) => (card.labels || []).some((l) => l.toLowerCase().includes(x)))
        )
          continue;
        if (f.priority && card.priority !== f.priority) continue;

        if (f.status === "overdue") {
          if (!(days !== null && days < 0 && status !== "done")) continue;
        } else if (f.status && f.status !== status) continue;

        if (f.due === "none") {
          if (card.dueDate) continue;
        } else if (f.due) {
          if (days === null) continue;
          if (f.due === "today" && days !== 0) continue;
          if (f.due === "tomorrow" && days !== 1) continue;
          if (f.due === "week" && !(days >= 0 && days <= 7)) continue;
          if (f.due === "overdue" && !(days < 0 && status !== "done")) continue;
        }

        const title = card.title.toLowerCase();
        const haystack = `${title} ${(card.description || "").toLowerCase()} ${(card.labels || [])
          .join(" ")
          .toLowerCase()} ${(card.assignee || "").toLowerCase()}`;
        if (!parsed.words.every((w) => haystack.includes(w))) continue;

        let score = 0;
        for (const w of parsed.words) score += title.startsWith(w) ? 4 : title.includes(w) ? 3 : 1;

        out.push({ card, board, list, status, days, score });
      }
    }
  }

  out.sort((a, b) => {
    if (parsed.words.length && b.score !== a.score) return b.score - a.score;
    return (a.days ?? 9999) - (b.days ?? 9999); 
  });
  return out.slice(0, limit);
};