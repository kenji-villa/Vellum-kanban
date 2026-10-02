import React from "react";
import TaskCard from "../Card/TaskCard";

const BoardColumn = ({ list, variant = "todo" }) => {
  const actionIcon = {
    todo: "+",
    inprogress: "…",
    done: "✓",
  }[variant];

  return (
    <div className="flex-1 min-w-[280px] flex flex-col">
      {/* Column Header */}
      <div className="bg-[#1e2757] text-white rounded-t-xl px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-sm tracking-wide">{list.title}</h2>
        <button className="text-white/70 hover:text-white text-lg leading-none">
          {actionIcon}
        </button>
      </div>

      {/* Cards Area */}
      <div className="bg-gray-200/50 rounded-b-xl p-3 flex flex-col gap-3 flex-1 min-h-[500px]">
        {list.cards.map((card) => (
          <TaskCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
