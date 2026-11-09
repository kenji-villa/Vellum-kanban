import React from "react";

export const KeyCombo = ({ keys, then = false }) => (
  <span className="inline-flex items-center gap-1">
    {keys.map((k, i) => (
      <React.Fragment key={`${k}-${i}`}>
        {i > 0 && then && (
          <span className="text-[10px] text-gray-400">then</span>
        )}
        <kbd className="px-2 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded shadow-sm">
          {k}
        </kbd>
      </React.Fragment>
    ))}
  </span>
);
