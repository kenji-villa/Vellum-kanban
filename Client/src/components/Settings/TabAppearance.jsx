import React from "react";
import { useSettings } from "../../context/SettingsContext";

const THEMES = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "💻" },
];

const ACCENTS = [
  { id: "orange", color: "#f97316" },
  { id: "blue", color: "#3b82f6" },
  { id: "purple", color: "#8b5cf6" },
  { id: "emerald", color: "#10b981" },
  { id: "rose", color: "#f43f5e" },
];

const TabAppearance = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Appearance
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize how Vellum looks on your device.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Theme */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Theme
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSetting("theme", t.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                settings.theme === t.id
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                {t.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Accent Color
        </p>
        <div className="flex gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => updateSetting("accent", a.id)}
              className={`w-10 h-10 rounded-full transition-transform ${
                settings.accent === a.id
                  ? "ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-100 dark:ring-offset-slate-900 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: a.color }}
              aria-label={`Accent ${a.id}`}
            />
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-5 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
          Preview
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
            ET
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Accent Preview
            </p>
            <p className="text-xs text-[var(--accent)] font-medium">
              This is how it looks
            </p>
          </div>
          <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium px-3 py-1.5 rounded-lg">
            Save
          </button>
        </div>
      </div>

      {/* Compact mode */}
      <div>
        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Compact Mode
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Reduce spacing in cards and lists
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.compactMode}
            onChange={(e) => updateSetting("compactMode", e.target.checked)}
            className="w-5 h-5 accent-orange-500"
          />
        </label>
      </div>
    </div>
  );
};

export default TabAppearance;
