import React from "react";

const team = [
  { name: "Juliana Reyes", color: "bg-blue-500" },
  { name: "Marcus Chen", color: "bg-teal-500" },
  { name: "Mitra Chan", color: "bg-amber-500" },
  { name: "Priya Nair", color: "bg-stone-400" },
  { name: "Tomas Rivera", color: "bg-rose-500" },
  { name: "Elena Vos", color: "bg-slate-500" },
];

const TeamDirectory = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-2">
        Team Directory
      </h3>

      {/* Decorative bar (matches reference's soft placeholder feel) */}
      <div className="h-1 w-1/3 bg-gray-100 rounded-full mb-5" />

      <div className="flex items-start justify-between gap-2 overflow-x-auto">
        {team.map((t) => (
          <div
            key={t.name}
            className="flex flex-col items-center text-center shrink-0 min-w-[60px]"
          >
            <div
              className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-semibold text-sm mb-2 ring-2 ring-white shadow-sm`}
            >
              {t.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <p className="text-[10px] font-medium text-gray-700 leading-tight">
              {t.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDirectory;
