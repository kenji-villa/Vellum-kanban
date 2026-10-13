import React from "react";
import { useSettings } from "../../context/SettingsContext";

const PRIORITIES = ["high", "medium", "low"];

const ALL_LABELS = [
  "Design",
  "UI",
  "Development",
  "Bug",
  "System",
  "Research",
  "Marketing",
];

const TabBoardDefaults = () => {
  const { settings, updateSetting } = useSettings();

  const toggleLabel = (label) => {
    const current = settings.defaultLabels || [];
    updateSetting(
      "defaultLabels",
      current.includes(label)
        ? current.filter((l) => l !== label)
        : [...current, label],
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Board Defaults
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          These values will be pre-selected when creating a new task.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Default priority */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Default Priority
        </p>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => {
            const color = {
              high: "bg-red-500",
              medium: "bg-amber-500",
              low: "bg-emerald-500",
            }[p];
            return (
              <button
                key={p}
                onClick={() => updateSetting("defaultPriority", p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  settings.defaultPriority === p
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-gray-800 dark:text-gray-100"
                    : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Default labels */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Default Labels
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_LABELS.map((label) => {
            const active = (settings.defaultLabels || []).includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-orange-400"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBoardDefaults;
