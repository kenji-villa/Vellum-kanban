import React from "react";

const comments = [
  {
    id: 1,
    name: "Elon S.",
    context: "Market research 2024",
    message: "Find my keynote attached in the...",
    color: "bg-blue-400",
  },
  {
    id: 2,
    name: "Dana R.",
    context: "Market research 2024",
    message: "I've added some new data. Let's...",
    color: "bg-orange-400",
  },
];

const tags = [
  {
    name: "#Research",
    subtitle: "Survey design",
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  {
    name: "#Strategy",
    subtitle: "SWOT analysis",
    bg: "bg-green-50",
    color: "text-green-600",
  },
  {
    name: "#Operations",
    subtitle: "Structure design",
    bg: "bg-yellow-50",
    color: "text-yellow-700",
  },
];

const NewComments = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">New comments</h3>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
            >
              <div
                className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-gray-500 truncate">
                  {c.name} in {c.context}
                </p>
                <p className="text-xs text-gray-800 font-medium truncate">
                  {c.message}
                </p>
              </div>
              <span className="text-gray-400 self-center">›</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="grid grid-cols-3 gap-3">
        {tags.map((t) => (
          <div
            key={t.name}
            className={`${t.bg} rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow`}
          >
            <p className={`text-xs font-bold ${t.color}`}>{t.name}</p>
            <p className="text-[11px] text-gray-600 mt-0.5">{t.subtitle}</p>
            <span className="text-gray-400 text-xs">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewComments;
