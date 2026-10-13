import React from "react";

const STACK = [
  { name: "React 18", role: "UI library" },
  { name: "Vite", role: "Build tool" },
  { name: "Tailwind CSS v4", role: "Styling" },
  { name: "React Router", role: "Routing" },
  { name: "dnd-kit", role: "Drag & drop" },
  { name: "date-fns", role: "Date utilities" },
];

const TabAbout = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        About Vellum
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Version 1.0.0 · A minimal Kanban for focused teams.
      </p>
    </div>

    <div className="border-t border-gray-100 dark:border-slate-700" />

    <div className="bg-gradient-to-br from-[#1e2757] to-[#0f1738] rounded-2xl p-6 text-white">
      <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-xl mb-4">
        V
      </div>
      <p className="text-sm leading-relaxed opacity-90">
        Vellum is a lightweight Kanban board designed for people who want a
        clean, distraction-free way to organize their work. All your data lives
        locally on your device — no accounts, no servers, no tracking.
      </p>
    </div>

    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
        Built with
      </p>
      <div className="grid grid-cols-2 gap-2">
        {STACK.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
          >
            <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
              {s.name}
            </span>
            <span className="text-[10px] text-gray-400">{s.role}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TabAbout;
