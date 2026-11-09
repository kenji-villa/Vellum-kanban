import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useBoard } from "../context/BoardContext";

const PAGES = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Calendar", path: "/calendar" },
  { label: "Analytics", path: "/analytics" },
  { label: "Team", path: "/team" },
  { label: "My profile", path: "/profile" },
  { label: "Settings", path: "/settings" },
];

const fire = (name) => () => window.dispatchEvent(new CustomEvent(name));

const CommandPalette = ({
  isOpen,
  onClose,
  onToggleTheme,
  onShowShortcuts,
}) => {
  const navigate = useNavigate();
  const { state } = useBoard();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActive(0);
    }
  }, [isOpen]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actions = [
      {
        id: "a-task",
        label: "New task",
        hint: "Command",
        run: fire("vellum:new-task"),
      },
      {
        id: "a-board",
        label: "New board",
        hint: "Command",
        run: fire("vellum:new-board"),
      },
      {
        id: "a-theme",
        label: "Toggle dark mode",
        hint: "Command",
        run: onToggleTheme,
      },
      {
        id: "a-keys",
        label: "Show keyboard shortcuts",
        hint: "Command",
        run: onShowShortcuts,
      },
    ];
    const pages = PAGES.map((p) => ({
      id: `p-${p.path}`,
      label: p.label,
      hint: "Go to",
      path: p.path,
    }));
    const boards = state.boards.map((b) => ({
      id: `b-${b.id}`,
      label: b.title,
      hint: "Board",
      path: `/board/${b.id}`,
    }));

    const base = [...actions, ...pages, ...boards];
    const matches = q
      ? base.filter((i) => i.label.toLowerCase().includes(q))
      : base.slice(0, 10);

    // Tasks are only searched once you've typed something
    const tasks = [];
    if (q.length >= 2) {
      for (const b of state.boards) {
        for (const l of b.lists) {
          for (const c of l.cards) {
            if (c.title.toLowerCase().includes(q) && tasks.length < 6) {
              tasks.push({
                id: `c-${c.id}`,
                label: c.title,
                hint: `Task · ${b.title}`,
                path: `/board/${b.id}`,
              });
            }
          }
        }
      }
    }
    return [...matches, ...tasks];
  }, [query, state.boards, onToggleTheme, onShowShortcuts]);

  // Keep the highlighted row in view
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, items]);

  if (!isOpen) return null;

  const run = (item) => {
    onClose();
    if (item.run) item.run();
    else navigate(item.path);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[active]) run(items[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-slate-700">
          <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, boards and tasks, or run a command…"
            className="flex-1 bg-transparent py-4 text-sm outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] text-gray-500 bg-gray-100 dark:bg-slate-700 rounded">
            Esc
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {items.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-gray-400">
              No results for “{query}”
            </li>
          ) : (
            items.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(item)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left text-sm ${
                    i === active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {item.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700 text-[11px] text-gray-400 flex gap-4">
          <span>↑↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CommandPalette;
