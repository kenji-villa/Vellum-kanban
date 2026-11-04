import React, { useState } from "react";

const TagInput = ({
  value = [],
  onChange,
  placeholder,
  suggestions = [],
  max = 12,
}) => {
  const [text, setText] = useState("");

  const add = (raw) => {
    const t = raw.trim().replace(/,$/, "").trim();
    if (!t) return;
    if (value.some((v) => v.toLowerCase() === t.toLowerCase())) {
      setText("");
      return;
    }
    if (value.length >= max) return;
    onChange([...value, t.slice(0, 30)]);
    setText("");
  };
  const remove = (t) => onChange(value.filter((v) => v !== t));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(text);
    } else if (e.key === "Backspace" && !text && value.length) {
      remove(value[value.length - 1]);
    }
  };

  const remaining = suggestions
    .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()))
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-[var(--accent-ring)]">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)]"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              aria-label={`Remove ${t}`}
              className="w-4 h-4 rounded-full leading-none hover:bg-[var(--accent)] hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(text)}
          disabled={value.length >= max}
          placeholder={value.length ? "" : placeholder}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none px-1 py-1 dark:text-white"
        />
      </div>

      {remaining.length > 0 && value.length < max && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[11px] text-gray-400">Suggestions:</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-gray-400 mt-1">
        Press Enter or comma to add · {value.length}/{max}
      </p>
    </div>
  );
};

export default TagInput;
