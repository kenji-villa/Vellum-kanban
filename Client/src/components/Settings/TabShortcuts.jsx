import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { KeyCombo } from "../UI/KeyCombo";
import { SHORTCUT_GROUPS } from "../../utils/shortcuts";

const fire = (name) => () => window.dispatchEvent(new CustomEvent(name));

const TabShortcuts = () => {
  const { settings, updateSetting } = useSettings();
  const enabled = settings.shortcutsEnabled !== false;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Keyboard Shortcuts
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Move around Vellum without leaving the keyboard. Press{" "}
          <kbd className="px-1.5 py-0.5 text-[11px] bg-gray-100 dark:bg-slate-700 rounded">
            ?
          </kbd>{" "}
          anywhere to see this list.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 dark:border-slate-700 rounded-xl">
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            Enable keyboard shortcuts
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Turn this off if single-key shortcuts get in your way.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => updateSetting("shortcutsEnabled", !enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
            enabled ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fire("vellum:open-palette")}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
        >
          Try the command palette
        </button>
        <button
          type="button"
          onClick={fire("vellum:open-shortcuts")}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
        >
          Open the cheat sheet
        </button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 ${enabled ? "" : "opacity-50"}`}
      >
        {SHORTCUT_GROUPS.map((g) => (
          <section key={g.title}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              {g.title}
            </h3>
            <div className="space-y-1">
              {g.items.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {s.label}
                  </span>
                  <KeyCombo keys={s.keys} then={s.then} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TabShortcuts;
