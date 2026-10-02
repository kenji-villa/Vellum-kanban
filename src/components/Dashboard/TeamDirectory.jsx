import React from "react";

const team = [
  { name: "Dana R.", role: "Project Manager", color: "bg-orange-400" },
  { name: "Elon S.", role: "Key Account Plann.", color: "bg-blue-500" },
  { name: "Nancy W.", role: "Account Manager", color: "bg-pink-400" },
  { name: "James M.", role: "Digital Manager", color: "bg-indigo-500" },
];

const TeamDirectory = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Team directory</h3>
      <div className="grid grid-cols-2 gap-3">
        {team.map((t) => (
          <div
            key={t.name}
            className="bg-gray-50 rounded-xl p-3 flex flex-col items-center text-center"
          >
            <div
              className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold mb-2`}
            >
              {t.name.charAt(0)}
            </div>
            <p className="text-xs font-semibold text-gray-800">{t.name}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDirectory;
