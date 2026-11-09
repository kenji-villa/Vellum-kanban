import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FiSearch, FiX, FiClock, FiLayout, FiUser } from "react-icons/fi";
import { useBoard } from "../context/BoardContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import {
  parseQuery,
  searchBoards,
  searchTasks,
} from "../utils/searchWorkspace";

const RECENT_KEY = "vellum_recent_searches_v1";

const TIPS = [
  { text: "@me", hint: "assigned to me" },
  { text: "#bug", hint: "by label" },
  { text: "due:today", hint: "due today" },
  { text: "is:overdue", hint: "overdue" },
  { text: "is:review", hint: "waiting for review" },
  { text: "priority:high", hint: "high priority" },
];

const PRIORITY_DOT = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").slice(0, 5);
  } catch {
    return [];
  }
};

const Highlight = ({ text, words }) => {
  if (!words.length) return text;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "ig"));
  return parts.map((part, i) =>
    i % 2 ? (
      <mark
        key={i}
        className="bg-[var(--accent-soft)] text-inherit rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

const GroupTitle = ({ children }) => (
  <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
    {children}
  </p>
);

const SearchBar = () => {
  const navigate = useNavigate();
  const { state } = useBoard();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState(loadRecent);
  const [team, setTeam] = useState(null);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const parsed = useMemo(() => parseQuery(query), [query]);

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const loadTeam = () => {
    if (team !== null) return;
    api
      .getTeam()
      .then((t) => setTeam(t.members.map((m) => m.user)))
      .catch(() => setTeam([]));
  };

  const saveRecent = (q) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const groups = useMemo(() => {
    const g = [];

    if (parsed.empty) {
      if (recent.length) {
        g.push({
          title: "Recent searches",
          rows: recent.map((r) => ({
            key: `r-${r}`,
            kind: "recent",
            label: r,
          })),
        });
      }
      let lastId = null;
      try {
        lastId = localStorage.getItem("vellum_last_board");
      } catch {
        /* ignore */
      }
      const ordered = [...state.boards].sort(
        (a, b) => (b.id === lastId ? 1 : 0) - (a.id === lastId ? 1 : 0),
      );
      if (ordered.length) {
        g.push({
          title: "Jump back in",
          rows: ordered.slice(0, 4).map((b) => ({
            key: `b-${b.id}`,
            kind: "board",
            label: b.title,
            sub: `${b.lists.reduce((n, l) => n + l.cards.length, 0)} tasks`,
            path: `/board/${b.id}`,
          })),
        });
      }
      return g;
    }

    const boards = searchBoards(state.boards, parsed);
    if (boards.length) {
      g.push({
        title: "Boards",
        rows: boards.map((b) => ({
          key: `b-${b.id}`,
          kind: "board",
          label: b.title,
          sub: `${b.lists.length} lists`,
          path: `/board/${b.id}`,
        })),
      });
    }

    const tasks = searchTasks(state.boards, parsed, user?.id);
    if (tasks.length) {
      g.push({
        title: "Tasks",
        rows: tasks.map((t) => ({
          key: `t-${t.card.id}`,
          kind: "task",
          ...t,
          path: `/board/${t.board.id}?task=${t.card.id}`,
        })),
      });
    }

    if (!parsed.hasFilters && parsed.words.length && team?.length) {
      const people = team.filter((p) =>
        parsed.words.every((w) =>
          `${p.name} ${p.title || ""}`.toLowerCase().includes(w),
        ),
      );
      if (people.length) {
        g.push({
          title: "People",
          rows: people.slice(0, 4).map((p) => ({
            key: `p-${p.id}`,
            kind: "person",
            label: p.name,
            sub: p.title || "Teammate",
            path: "/team",
          })),
        });
      }
    }
    return g;
  }, [parsed, state.boards, user?.id, team, recent]);

  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups]);

  // Keep the highlighted row visible
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, flat]);

  const choose = (row) => {
    if (row.kind === "recent") {
      setQuery(row.label);
      setActive(0);
      inputRef.current?.focus();
      return;
    }
    if (!parsed.empty) saveRecent(query.trim());
    setOpen(false);
    inputRef.current?.blur();
    navigate(row.path);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (flat[active]) {
        e.preventDefault();
        choose(flat[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const applyTip = (text) => {
    setQuery((q) => `${q.trim()} ${text} `.trimStart());
    setActive(0);
    inputRef.current?.focus();
  };

  let n = 0; // running row index across groups

  return (
    <div ref={wrapRef} className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        data-shortcut-search
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          loadTeam();
        }}
        onKeyDown={onKeyDown}
        placeholder="Search boards, tasks and people…  try @me or due:today"
        className="w-full bg-white dark:bg-slate-800 dark:text-gray-100 rounded-2xl pl-11 pr-12 py-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <FiX className="w-4 h-4" />
        </button>
      ) : (
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-700 rounded pointer-events-none">
          /
        </kbd>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-fade-in">
          <div ref={listRef} className="max-h-[26rem] overflow-y-auto pb-2">
            {groups.map((g) => (
              <div key={g.title}>
                <GroupTitle>{g.title}</GroupTitle>
                {g.rows.map((row) => {
                  const i = n++;
                  return (
                    <button
                      key={row.key}
                      type="button"
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(row)}
                      className={`w-full flex items-center gap-3 px-3 py-2 mx-1 rounded-lg text-left ${
                        i === active ? "bg-[var(--accent-soft)]" : ""
                      }`}
                      style={{ width: "calc(100% - 0.5rem)" }}
                    >
                      {row.kind === "recent" && (
                        <FiClock className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      {row.kind === "board" && (
                        <FiLayout className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      {row.kind === "person" && (
                        <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      {row.kind === "task" && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${PRIORITY_DOT[row.card.priority] || "bg-gray-400"}`}
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-100 truncate">
                          {row.kind === "task" ? (
                            <Highlight
                              text={row.card.title}
                              words={parsed.words}
                            />
                          ) : row.kind === "recent" ? (
                            row.label
                          ) : (
                            <Highlight text={row.label} words={parsed.words} />
                          )}
                        </p>
                        {row.kind === "task" && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {row.board.title} · {row.list.title}
                            {row.card.assignee ? ` · ${row.card.assignee}` : ""}
                          </p>
                        )}
                        {(row.kind === "board" || row.kind === "person") && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {row.sub}
                          </p>
                        )}
                      </div>

                      {row.kind === "task" && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {row.status === "done" && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Done
                            </span>
                          )}
                          {row.status === "review" && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              In review
                            </span>
                          )}
                          {row.card.dueDate && row.status !== "done" && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                row.days < 0
                                  ? "bg-red-100 text-red-600"
                                  : row.days <= 1
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-300"
                              }`}
                            >
                              {row.days < 0
                                ? "Overdue"
                                : row.days === 0
                                  ? "Today"
                                  : row.days === 1
                                    ? "Tomorrow"
                                    : format(
                                        new Date(row.card.dueDate),
                                        "MMM d",
                                      )}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {!parsed.empty && flat.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nothing matches “{query.trim()}”
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Try fewer words, or filters like @me, #label or due:today.
                </p>
              </div>
            )}
          </div>

          <div className="px-3 py-2.5 border-t border-gray-100 dark:border-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Search tips
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TIPS.map((t) => (
                <button
                  key={t.text}
                  type="button"
                  onClick={() => applyTip(t.text)}
                  title={t.hint}
                  className="text-[11px] px-2 py-1 rounded-full border border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {t.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
