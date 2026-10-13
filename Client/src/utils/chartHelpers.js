import { startOfWeek, subWeeks, format, isSameWeek, parseISO } from "date-fns";

/**
 * Get all cards across all boards as a flat list with board info.
 */
export const getAllCards = (boards) =>
  boards.flatMap((board) =>
    board.lists.flatMap((list) =>
      list.cards.map((card) => ({
        ...card,
        boardId: board.id,
        boardTitle: board.title,
        listTitle: list.title,
        isDone:
          list.title.toLowerCase().includes("done") ||
          list.title.toLowerCase().includes("complete"),
        isInProgress: list.title.toLowerCase().includes("progress"),
      }))
    )
  );

/**
 * Count unique assignees across all cards.
 */
export const getUniqueAssignees = (boards) => {
  const set = new Set();
  boards.forEach((board) =>
    board.lists.forEach((list) =>
      list.cards.forEach((card) => {
        if (card.assignee) set.add(card.assignee.trim());
      })
    )
  );
  return Array.from(set);
};

/**
 * Distribution of labels across all cards.
 */
export const getLabelDistribution = (boards) => {
  const counts = {};
  boards.forEach((board) =>
    board.lists.forEach((list) =>
      list.cards.forEach((card) => {
        (card.labels || []).forEach((label) => {
          counts[label] = (counts[label] || 0) + 1;
        });
      })
    )
  );
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Cards grouped by day of week (Mon..Sun).
 */
export const getCardsByDayOfWeek = (boards) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = days.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});

  getAllCards(boards).forEach((card) => {
    if (!card.dueDate) return;
    const idx = parseISO(card.dueDate).getDay(); // 0 = Sun
    const dayName = days[(idx + 6) % 7]; // shift to Mon-first
    counts[dayName] += 1;
  });

  return days.map((day) => ({ day, count: counts[day] }));
};

/**
 * Cards by week — done vs. in-progress — for last N weeks.
 */
export const getVelocityByWeek = (boards, weeks = 6) => {
  const buckets = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    buckets.push({
      weekStart: startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }),
      label: format(subWeeks(now, i), "'W'ww"),
      done: 0,
      inProgress: 0,
      total: 0,
    });
  }

  getAllCards(boards).forEach((card) => {
    if (!card.dueDate) return;
    const due = parseISO(card.dueDate);
    for (const bucket of buckets) {
      if (isSameWeek(due, bucket.weekStart, { weekStartsOn: 1 })) {
        bucket.total += 1;
        if (card.isDone) bucket.done += 1;
        else if (card.isInProgress) bucket.inProgress += 1;
        break;
      }
    }
  });

  return buckets;
};