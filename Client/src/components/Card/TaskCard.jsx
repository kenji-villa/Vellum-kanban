import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PersonAvatar from "../Team/PersonAvatar";
import { labelColor } from "../../utils/labels";

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const TaskCard = ({ card, onClick, people = [], boardLabels = [] }) => {
  const person = people.find((p) => p.id === card.assigneeId);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", card } });

  const done = card.status === "DONE";
  const inReview = card.status === "SUBMITTED";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityClass = priorityDot[card.priority] || "bg-gray-400";
  const formattedDate = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border border-gray-100 dark:border-slate-700 touch-none"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${priorityClass}`} />
          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">
            {card.priority}
          </span>
        </div>
        {(card.assigneeId || card.assignee) && (
          <span title={person?.name || card.assignee}>
            {person ? (
              <PersonAvatar user={person} size={24} />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
                {(card.assignee || "?").charAt(0)}
              </div>
            )}
          </span>
        )}
      </div>

      {inReview && (
        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
          In review
        </span>
      )}
      {done && (
        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          ✓ Done
        </span>
      )}
      <h3
        className={`"font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1 ${done ? "line-through opacity-60" : ""}`}
      >
        {card.title}
      </h3>

      {card.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {card.description}
        </p>
      )}

      {card.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label) => (
            <span
              key={label}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${labelColor(label, boardLabels).pill}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-gray-400">
        {formattedDate && <span>📅 {formattedDate}</span>}
        {card.comments > 0 && <span>💬 {card.comments}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
