import React from "react";
import { useBoard } from "../../context/BoardContext";
import { differenceInCalendarDays, isBefore, startOfDay } from "date-fns";

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const UrgentTasks = () => {
  const { state } = useBoard();
  const today = startOfDay(new Date());

  // Gather all cards across boards, filter urgent (high priority OR overdue/due soon)
  const allCards = state.boards.flatMap((board) =>
    board.lists.flatMap((list) =>
      list.cards.map((card) => ({
        ...card,
        boardTitle: board.title,
        listTitle: list.title,
      })),
    ),
  );

  const urgent = allCards
    .filter((card) => {
      if (card.priority === "high") return true;
      if (!card.dueDate) return false;
      const due = new Date(card.dueDate);
      const days = differenceInCalendarDays(due, today);
      return days <= 3;
    })
    .slice(0, 4);

  const formatDue = (dueDate) => {
    if (!dueDate) return "";
    const due = new Date(dueDate);
    const days = differenceInCalendarDays(due, today);
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days}d`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">Urgent Tasks</h3>

      {urgent.length === 0 ? (
        <div className="text-xs text-gray-400 py-6 text-center">
          No urgent tasks right now 🎉
        </div>
      ) : (
        <ul className="space-y-4">
          {urgent.map((card) => (
            <li key={card.id} className="flex items-start gap-3">
              <span
                className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                  priorityDot[card.priority] || "bg-gray-400"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800 font-medium truncate">
                  {card.title}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {card.boardTitle} · {card.listTitle}
                </p>
              </div>
              {card.dueDate && (
                <span
                  className={`text-[11px] font-medium shrink-0 ${
                    formatDue(card.dueDate) === "Overdue"
                      ? "text-red-500"
                      : "text-pink-500"
                  }`}
                >
                  {formatDue(card.dueDate)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UrgentTasks;
