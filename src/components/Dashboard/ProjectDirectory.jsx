import React from "react";

const AvatarStack = () => (
  <div className="flex -space-x-2">
    <div className="w-6 h-6 rounded-full bg-purple-400 border-2 border-white" />
    <div className="w-6 h-6 rounded-full bg-pink-400 border-2 border-white" />
    <div className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-white" />
  </div>
);

const ProjectDirectory = () => {
  const projects = [
    "Market research 2024",
    "New proposals",
    "Brand sprints",
    "Customer experience Q3",
    "Market research 2024",
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Project directory</h3>
      <ul className="divide-y divide-gray-100">
        {projects.map((p, i) => (
          <li key={i} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📊</span>
              <span className="text-sm text-gray-700">{p}</span>
            </div>
            <AvatarStack />
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
        + Add more
      </button>
    </div>
  );
};

export default ProjectDirectory;
