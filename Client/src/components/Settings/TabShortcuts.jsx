import React from "react";

const SHORTCUTS = [
  { keys: ["/"], description: "Focus the search bar" },
  { keys: ["Ctrl", "D"], description: "Toggle dark mode" },
  { keys: ["Esc"], description: "Close open modal or dropdown" },
  { keys: ["Enter"], description: "Save task / submit form" },
  { keys: ["Shift", "Enter"], description: "New line in description" },
];

const TabShortcuts = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Keyboard Shortcuts
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Work faster with these handy shortcuts.
      </p>
    </div>

    <div className="border-t border-gray-100 dark:border-slate-700" />

    <div className="space-y-2">
      {SHORTCUTS.map((s) => (
        <div
          key={s.description}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {s.description}
          </span>
          <div className="flex items-center gap-1">
            {s.keys.map((k) => (
              <kbd
                key={k}
                className="px-2 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded shadow-sm"
              >
                {k}
              </kbd>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TabShortcuts;
