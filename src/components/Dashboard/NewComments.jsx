import React from "react";
import { useBoard } from "../../context/BoardContext";

const avatarColors = [
  "bg-blue-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-teal-400",
];
const colorFor = (name = "") => {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
};

const NewComments = () => {
  const { state } = useBoard();

  const recent = state.boards
    .flatMap((b) =>
      b.lists.flatMap((l) =>
        l.cards.map((c) => ({
          ...c,
          boardTitle: b.title,
          listTitle: l.title,
        })),
      ),
    )
    .filter((c) => c.assignee || c.description)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">
        Recent Activity
      </h3>

      {recent.length === 0 ? (
        <div className="text-xs text-gray-400 py-6 text-center">
          No recent activity
        </div>
      ) : (
        <ul className="space-y-3">
          {recent.map((card) => (
            <li
              key={card.id}
              className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
            >
              <div
                className={`w-8 h-8 rounded-full ${colorFor(
                  card.assignee || card.title,
                )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {(card.assignee || card.title).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-400 truncate">
                  {card.assignee || "Someone"} in {card.boardTitle}
                </p>
                <p className="text-xs text-gray-800 font-medium truncate">
                  {card.title}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewComments;
