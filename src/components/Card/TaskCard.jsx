import React from "react";

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const labelColors = {
  Design: "bg-pink-100 text-pink-700",
  UI: "bg-purple-100 text-purple-700",
  Development: "bg-blue-100 text-blue-700",
  Bug: "bg-red-100 text-red-700",
  System: "bg-gray-200 text-gray-700",
  Shipped: "bg-green-100 text-green-700",
};

const TaskCard = ({ card }) => {
  const priorityClass = priorityDot[card.priority] || "bg-gray-400";
  const formattedDate = card.dueDate
    ? new Date(card.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
      {/* Priority + Assignee */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${priorityClass}`} />
          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">
            {card.priority}
          </span>
        </div>
        {card.assignee && (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-700">
            {card.assignee.charAt(0)}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">
        {card.title}
      </h3>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label) => (
            <span
              key={label}
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                labelColors[label] || "bg-gray-100 text-gray-600"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Date + Comments */}
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        {formattedDate && (
          <span className="flex items-center gap-1">📅 {formattedDate}</span>
        )}
        {card.comments > 0 && (
          <span className="flex items-center gap-1">💬 {card.comments}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
