import React from "react";
import {
  FiCheck,
  FiSearch,
  FiSend,
  FiRotateCcw,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";
import { LABEL_COLORS } from "../../utils/labels";

const DOT = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

export const Frame = ({ title, children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-2xl shadow-[#1e2757]/10 overflow-hidden ${className}`}
  >
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-900/40">
      <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
      <span className="ml-3 text-[11px] text-gray-400 truncate">{title}</span>
    </div>
    {children}
  </div>
);

const Av = ({ bg, children, size = 28 }) => (
  <span
    className={`${bg} rounded-full text-white font-bold flex items-center justify-center shrink-0`}
    style={{ width: size, height: size, fontSize: size * 0.38 }}
  >
    {children}
  </span>
);

const Pill = ({ color, children }) => (
  <span
    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LABEL_COLORS[color].pill}`}
  >
    {children}
  </span>
);

/* ---------------- Boards ---------------- */
const COLS = [
  {
    name: "To Do",
    color: "#3b82f6",
    cards: [
      { t: "Plan the launch", p: "medium", l: "Marketing", c: "yellow" },
      { t: "Fix the login bug", p: "high", l: "Bug", c: "red" },
    ],
  },
  {
    name: "In Progress",
    color: "#f59e0b",
    cards: [{ t: "Design the landing page", p: "low", l: "Design", c: "pink" }],
    drag: {
      t: "Write the release notes",
      p: "medium",
      l: "Research",
      c: "orange",
    },
  },
  {
    name: "Done",
    color: "#22c55e",
    cards: [
      {
        t: "Set up the database",
        p: "medium",
        l: "Development",
        c: "blue",
        done: true,
      },
    ],
  },
];

export const BoardsMock = () => (
  <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/60 dark:bg-slate-900/30">
    {COLS.map((col) => (
      <div
        key={col.name}
        className="rounded-xl bg-gray-100/80 dark:bg-slate-700/40 p-2.5"
      >
        <div className="flex items-center gap-2 px-1 mb-2.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: col.color }}
          />
          <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
            {col.name}
          </span>
          <span className="ml-auto text-[10px] text-gray-400">
            {col.cards.length + (col.drag ? 1 : 0)}
          </span>
        </div>
        <div className="space-y-2">
          {col.cards.map((c) => (
            <div
              key={c.t}
              className="rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 p-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${DOT[c.p]}`} />
                <Pill color={c.c}>{c.l}</Pill>
              </div>
              <p
                className={`text-[11px] font-medium text-gray-800 dark:text-gray-100 ${c.done ? "line-through opacity-60" : ""}`}
              >
                {c.t}
              </p>
            </div>
          ))}
          {col.drag && (
            <div className="rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-[var(--accent-ring)] p-2.5 rotate-3 translate-x-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${DOT[col.drag.p]}`}
                />
                <Pill color={col.drag.c}>{col.drag.l}</Pill>
              </div>
              <p className="text-[11px] font-medium text-gray-800 dark:text-gray-100">
                {col.drag.t}
              </p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

/* ---------------- Team ---------------- */
export const TeamMock = () => (
  <div className="p-5 space-y-4">
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
      Share “Website redesign”
    </p>
    <div className="space-y-1">
      {[
        {
          n: "Daniel T.",
          t: "Product Lead",
          bg: "bg-sky-500",
          i: "DT",
          role: "Owner",
        },
        {
          n: "Sara K.",
          t: "Designer",
          bg: "bg-violet-500",
          i: "SK",
          role: "Editor",
        },
        {
          n: "Liya B.",
          t: "Stakeholder",
          bg: "bg-rose-500",
          i: "LB",
          role: "Viewer",
        },
      ].map((p) => (
        <div
          key={p.n}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/40"
        >
          <Av bg={p.bg} size={36}>
            {p.i}
          </Av>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {p.n}
            </p>
            <p className="text-[10px] text-gray-400">{p.t}</p>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
            {p.role}
          </span>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-dashed border-gray-200 dark:border-slate-600 p-3 flex items-center gap-3">
      <Av bg="bg-amber-500" size={32}>
        NG
      </Av>
      <p className="flex-1 text-xs text-gray-600 dark:text-gray-300">
        Nati G. · Add as
      </p>
      <span className="text-[10px] font-medium px-2 py-1 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-500">
        Editor ▾
      </span>
      <span className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white">
        Add
      </span>
    </div>
  </div>
);

/* ---------------- Review ---------------- */
export const ReviewMock = () => {
  const steps = [
    { n: "Open", s: "done" },
    { n: "In review", s: "active" },
    { n: "Done", s: "todo" },
  ];
  return (
    <div className="p-5 space-y-4 relative">
      <div className="flex items-center gap-2">
        <Pill color="pink">Design</Pill>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Landing page copy
        </p>
      </div>

      <div className="flex items-center">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  s.s === "done"
                    ? "bg-green-500 text-white"
                    : s.s === "active"
                      ? "bg-amber-400 text-white ring-4 ring-amber-100 dark:ring-amber-900/40"
                      : "bg-gray-200 dark:bg-slate-600 text-gray-400"
                }`}
              >
                {s.s === "done" ? <FiCheck className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span className="text-[10px] text-gray-500">{s.n}</span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`flex-1 h-0.5 mx-2 mb-4 ${i === 0 ? "bg-green-400" : "bg-gray-200 dark:bg-slate-600"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
          Note from Sara
        </p>
        <p className="text-xs text-gray-700 dark:text-gray-200">
          Copy updated for all three sections. Ready for a look!
        </p>
        <div className="flex gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white">
            <FiCheckCircle className="w-3 h-3" /> Approve
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-amber-400 text-amber-700">
            <FiRotateCcw className="w-3 h-3" /> Request changes
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-[#1e2757] text-white text-[11px] px-3 py-2 shadow-lg w-fit">
        <FiSend className="w-3 h-3 text-[var(--accent)]" />
        Sara submitted “Landing page copy” for review
      </div>
    </div>
  );
};

/* ---------------- Activity ---------------- */
export const ActivityMock = () => (
  <div className="p-5 space-y-4">
    <div className="flex gap-3">
      <Av bg="bg-violet-500" size={30}>
        SK
      </Av>
      <div className="flex-1">
        <p className="text-xs">
          <b className="text-gray-800 dark:text-gray-100">Sara</b>{" "}
          <span className="text-gray-400">· 2h ago</span>
        </p>
        <p className="mt-1 text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
          I moved the hero to a darker background. Thoughts?
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-[11px] text-gray-500">
      <span className="w-[30px] h-[30px] rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm">
        ↔️
      </span>
      <p>
        <b className="text-gray-700 dark:text-gray-200">Daniel</b> moved this
        task from To Do to In Progress ·{" "}
        <span className="text-gray-400">1h ago</span>
      </p>
    </div>
    <div className="flex gap-3">
      <Av bg="bg-sky-500" size={30}>
        DT
      </Av>
      <div className="flex-1">
        <p className="text-xs">
          <b className="text-gray-800 dark:text-gray-100">Daniel</b>{" "}
          <span className="text-gray-400">· 40m ago</span>
        </p>
        <p className="mt-1 text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
          Love it. Can we keep the orange for the button?
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-[11px] text-gray-500">
      <span className="w-[30px] h-[30px] rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm">
        📅
      </span>
      <p>
        <b className="text-gray-700 dark:text-gray-200">Sara</b> set the due
        date to Fri · <span className="text-gray-400">now</span>
      </p>
    </div>
    <div className="rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2.5 flex items-center justify-between">
      <span className="text-xs text-gray-400">Write a comment…</span>
      <span className="text-[10px] font-semibold px-3 py-1 rounded-md bg-[var(--accent)] text-white">
        Comment
      </span>
    </div>
  </div>
);

/* ---------------- Live sync ---------------- */
const MiniBoard = ({ who, delay }) => (
  <div className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40 p-3">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
        {who}
      </span>
      <span className="flex items-center gap-1 text-[10px] text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
        Live
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
          To Do
        </p>
        <div
          className="rounded-lg bg-white dark:bg-slate-800 shadow-md border border-[var(--accent-ring)] p-2.5 animate-hop"
          style={{ animationDelay: delay }}
        >
          <p className="text-[11px] font-medium text-gray-800 dark:text-gray-100">
            Review the copy
          </p>
          <span className="block h-1 w-8 rounded-full bg-[var(--accent)] mt-2" />
        </div>
        <div className="rounded-lg bg-white/70 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 p-2.5">
          <span className="block h-1.5 w-14 rounded bg-gray-200 dark:bg-slate-600" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
          Doing
        </p>
        <div className="rounded-lg bg-white/70 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 p-2.5">
          <span className="block h-1.5 w-12 rounded bg-gray-200 dark:bg-slate-600" />
        </div>
      </div>
    </div>
  </div>
);

export const LiveMock = () => (
  <div className="p-5">
    <div className="flex gap-4">
      <MiniBoard who="You" delay="0s" />
      <MiniBoard who="Sara" delay="0.45s" />
    </div>
    <p className="mt-4 text-center text-[11px] text-gray-400">
      Move a card on one screen and it moves on the other, with no refresh.
    </p>
  </div>
);

/* ---------------- Search ---------------- */
export const SearchMock = () => (
  <div className="p-5 space-y-3">
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-600 px-4 py-3">
      <FiSearch className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-800 dark:text-gray-100">
        @me due:today
      </span>
      <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-500">
        Ctrl K
      </kbd>
    </div>
    {[
      {
        t: "Fix the checkout crash",
        b: "Website · To Do",
        chip: "Today",
        tone: "bg-orange-100 text-orange-600",
        p: "high",
      },
      {
        t: "Send the invoice",
        b: "Admin · In Progress",
        chip: "Today",
        tone: "bg-orange-100 text-orange-600",
        p: "medium",
      },
      {
        t: "Prep the weekly update",
        b: "Team · To Do",
        chip: "Overdue",
        tone: "bg-red-100 text-red-600",
        p: "low",
      },
    ].map((r) => (
      <div
        key={r.t}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/40"
      >
        <span className={`w-2.5 h-2.5 rounded-full ${DOT[r.p]}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 dark:text-gray-100">
            {r.t}
          </p>
          <p className="text-[10px] text-gray-400">{r.b}</p>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.tone}`}
        >
          {r.chip}
        </span>
      </div>
    ))}
  </div>
);

/* ---------------- Insights ---------------- */
export const InsightsMock = () => {
  const bars = [40, 65, 50, 85, 60, 95, 70];
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Boards", "4"],
          ["Tasks", "38"],
          ["Completed", "24"],
        ].map(([l, v]) => (
          <div
            key={l}
            className="rounded-xl bg-gray-50 dark:bg-slate-700/40 px-3 py-2.5"
          >
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">
              {v}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 items-end">
        <div className="col-span-3 flex items-end gap-2 h-28">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-[#1e2757] to-[var(--accent)]"
              style={{ height: `${h}%`, opacity: 0.55 + i * 0.06 }}
            />
          ))}
        </div>
        <div className="col-span-2 flex flex-col items-center">
          <svg viewBox="0 0 64 64" className="w-24 h-24 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              strokeWidth="7"
              className="stroke-gray-100 dark:stroke-slate-700"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="102 164"
              style={{ stroke: "var(--accent)" }}
            />
          </svg>
          <p className="text-[11px] text-gray-500 -mt-14 mb-9 font-bold text-gray-800 dark:text-gray-100">
            63%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/40 px-3 py-2">
        <FiCalendar className="w-3.5 h-3.5 text-orange-500" />
        <p className="text-[11px] text-gray-700 dark:text-gray-200">
          2 tasks are due tomorrow
        </p>
      </div>
    </div>
  );
};
