import React from "react";

const UrgentTasks = () => {
  const tasks = [
    { id: 1, title: "Finish monthly reporting", status: "Today" },
    { id: 2, title: "Report signing", status: "Today" },
    { id: 3, title: "Market overview keynote", status: "Today" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Urgent tasks</h3>
      <ul className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <span className="text-sm text-gray-700">{task.title}</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-pink-500">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UrgentTasks;
