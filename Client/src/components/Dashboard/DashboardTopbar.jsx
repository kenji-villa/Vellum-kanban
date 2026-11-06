import React, { useMemo } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useBoard } from "../../context/BoardContext";
import { isCardDone } from "../../utils/listStyle";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 min-w-[104px]">
    <p className="text-2xl font-bold leading-none">{value}</p>
    <p className="text-[11px] text-white/70 mt-1.5">{label}</p>
  </div>
);

const DashboardTopbar = () => {
  const { settings } = useSettings();
  const { state } = useBoard();

  const stats = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
    let total = 0,
      done = 0,
      urgent = 0,
      overdue = 0;
    for (const b of state.boards) {
      for (const l of b.lists) {
        for (const c of l.cards) {
          total++;
          if (isCardDone(c, l)) {
            done++;
          } else {
            if (c.priority === "high") urgent++;
            if (c.dueDate && c.dueDate < today) overdue++;
          }
        }
      }
    }
    return { boards: state.boards.length, total, done, urgent, overdue };
  }, [state.boards]);

  const message =
    stats.overdue > 0
      ? `You have ${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""}.`
      : stats.urgent > 0
        ? `${stats.urgent} high-priority task${stats.urgent > 1 ? "s" : ""} need your attention.`
        : stats.total === 0
          ? "Create your first board to get started."
          : "Everything is on track. Nice work!";

  const firstName = (settings.userName || "").split(" ")[0];
  const dateText = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-6">
      <div
        className="relative overflow-hidden rounded-3xl p-7 mb-5 text-white shadow-lg animate-rise"
        style={{
          background:
            "linear-gradient(120deg, #1e2757 0%, #2a3572 55%, var(--accent) 150%)",
        }}
      >
        {/* Decorative glows + dot grid */}
        <div className="pointer-events-none absolute -right-10 -top-16 w-64 h-64 rounded-full bg-[var(--accent)] opacity-30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute right-28 -bottom-20 w-56 h-56 rounded-full bg-sky-400 opacity-20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {dateText}
          </p>
          <h1 className="text-3xl font-bold mt-1">
            {greeting()}, {firstName}! 👋
          </h1>
          <p className="text-sm text-white/75 mt-1">{message}</p>

          <div className="flex flex-wrap gap-3 mt-5">
            <Stat label="Boards" value={stats.boards} />
            <Stat label="Tasks" value={stats.total} />
            <Stat label="Completed" value={stats.done} />
            <Stat label="High priority" value={stats.urgent} />
          </div>
        </div>
      </div>

      <div
        className="relative w-full animate-rise"
        style={{ animationDelay: "80ms" }}
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search projects, tasks, or people..."
          className="w-full bg-white dark:bg-slate-800 dark:text-gray-100 rounded-2xl pl-11 pr-4 py-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
    </div>
  );
};

export default DashboardTopbar;
