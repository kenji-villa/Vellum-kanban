import { isBefore, isToday, startOfDay, endOfDay, addDays } from "date-fns";

export const PRIORITIES = ["high", "medium", "low"];

export const LABELS = [
  "Design",
  "UI",
  "Development",
  "Bug",
  "System",
  "Research",
  "Marketing",
  "Shipped",
];

export const DUE_FILTERS = {
  overdue: "Overdue",
  today: "Due Today",
  week: "Due This Week",
  noDate: "No Due Date",
};

// Empty filter object
export const emptyFilters = {
  priorities: [],
  labels: [],
  due: [],
};

/**
 * Check if a card matches the search query
 */
const matchesSearch = (card, query) => {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();

  if (card.title?.toLowerCase().includes(q)) return true;
  if (card.description?.toLowerCase().includes(q)) return true;
  if (card.assignee?.toLowerCase().includes(q)) return true;
  if (card.labels?.some((l) => l.toLowerCase().includes(q))) return true;

  return false;
};

/**
 * Check if a card matches all active filters.
 * Empty arrays mean "no filter for this category" → pass.
 */
const matchesFilters = (card, filters) => {
  const { priorities, labels, due } = filters;
  const today = startOfDay(new Date());

  // Priority
  if (priorities.length > 0 && !priorities.includes(card.priority)) {
    return false;
  }

  // Labels: card passes if it has AT LEAST one of the selected labels
  if (labels.length > 0) {
    const cardLabels = card.labels || [];
    const hasMatch = labels.some((l) => cardLabels.includes(l));
    if (!hasMatch) return false;
  }

  // Due Date buckets
  if (due.length > 0) {
    const cardDue = card.dueDate ? startOfDay(new Date(card.dueDate)) : null;
    const weekEnd = endOfDay(addDays(today, 7));

    const passesDue =
      (due.includes("overdue") &&
        cardDue &&
        isBefore(cardDue, today)) ||
      (due.includes("today") && cardDue && isToday(cardDue)) ||
      (due.includes("week") &&
        cardDue &&
        !isBefore(cardDue, today) &&
        cardDue <= weekEnd) ||
      (due.includes("noDate") && !cardDue);

    if (!passesDue) return false;
  }

  return true;
};

/**
 * Filter an entire board's lists + cards.
 * Returns the same shape as board, but with only matching cards.
 * Empty lists remain visible (so users see their structure).
 */
export const filterBoard = (board, query, filters) => {
  return {
    ...board,
    lists: board.lists.map((list) => ({
      ...list,
      cards: list.cards.filter(
        (card) => matchesSearch(card, query) && matchesFilters(card, filters)
      ),
    })),
  };
};

/**
 * Count active filter items (for badge on filter button)
 */
export const countActiveFilters = (filters) =>
  filters.priorities.length + filters.labels.length + filters.due.length;