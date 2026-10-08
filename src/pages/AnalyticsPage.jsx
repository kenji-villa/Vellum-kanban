import React, { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import DonutChart from "../components/Analytics/DonutChart";
import { useBoard } from "../context/BoardContext";
import {
  getAllCards,
  getUniqueAssignees,
  getLabelDistribution,
  getCardsByDayOfWeek,
  getVelocityByWeek,
} from "../utils/chartHelpers";

const PALETTE = [
  "#f97316",
  "#1e2757",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
  "#facc15",
  "#64748b",
];

const AnalyticsPage = () => {
  const { state } = useBoard();

  const stats = useMemo(() => {
    const allCards = getAllCards(state.boards);
    const assignees = getUniqueAssignees(state.boards);
    const labelDist = getLabelDistribution(state.boards);
    const byDay = getCardsByDayOfWeek(state.boards);
    const byWeek = getVelocityByWeek(state.boards, 6);

    const done = allCards.filter((c) => c.isDone).length;
    const inProgress = allCards.filter((c) => c.isInProgress).length;
    const todo = allCards.length - done - inProgress;

    return {
      totalBoards: state.boards.length,
      totalCards: allCards.length,
      done,
      inProgress,
      todo,
      assignees,
      labelDist,
      byDay,
      byWeek,
    };
  }, [state.boards]);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Live analytics across all your boards
          </p>
        </div>

        {/* Top Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StatCard
            label="Total Projects"
            value={stats.totalBoards}
            accent="navy"
            sub={`${stats.totalCards} tasks across all boards`}
          />
          <StatCard
            label="Team Size"
            value={stats.assignees.length}
            accent="orange"
            avatars={stats.assignees}
          />
          <ProgressSummary stats={stats} />
        </div>

        {/* Middle Row: Project Progress (full width) */}
        <div className="mb-5">
          <ProjectProgress boards={state.boards} />
        </div>

        {/* Bottom Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CategoriesCard data={stats.labelDist} />
          <WorkingHoursCard data={stats.byDay} />
          <VelocityCard data={stats.byWeek} />
        </div>
      </div>
    </div>
  );
};

/* ============================ STAT CARD ============================ */
const StatCard = ({ label, value, accent, sub, avatars }) => {
  const accentBg = accent === "orange" ? "bg-orange-500" : "bg-[#1e2757]";
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 leading-none">
            {value}
          </p>
          {sub && <p className="text-[11px] text-gray-400 mt-2">{sub}</p>}
        </div>
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-2 shrink-0">
            {avatars.slice(0, 3).map((name, i) => (
              <div
                key={name}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white dark:border-slate-800"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                title={name}
              >
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            ))}
            {avatars.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 border-2 border-white dark:border-slate-800">
                +{avatars.length - 3}
              </div>
            )}
          </div>
        )}
        {!avatars && <div className={`w-10 h-10 rounded-full ${accentBg}`} />}
      </div>
    </div>
  );
};

/* ============================ PROGRESS SUMMARY ============================ */
const ProgressSummary = ({ stats }) => {
  const total = stats.totalCards || 1;
  const donePct = Math.round((stats.done / total) * 100);
  const inProgressPct = Math.round((stats.inProgress / total) * 100);
  const todoPct = 100 - donePct - inProgressPct;

  const bars = [
    { label: "Done", value: stats.done, pct: donePct, color: "bg-emerald-500" },
    {
      label: "In Progress",
      value: stats.inProgress,
      pct: inProgressPct,
      color: "bg-orange-500",
    },
    { label: "To Do", value: stats.todo, pct: todoPct, color: "bg-[#1e2757]" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Overall Progress
      </p>

      {/* Horizontal stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-gray-100 dark:bg-slate-700">
        {bars.map((b) => (
          <div
            key={b.label}
            className={`${b.color} transition-all`}
            style={{ width: `${b.pct}%` }}
            title={`${b.label}: ${b.pct}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {b.label}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {b.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================ PROJECT PROGRESS (GANTT-LIKE) ============================ */
const ProjectProgress = ({ boards }) => {
  const maxCards = Math.max(
    1,
    ...boards.map((b) => b.lists.reduce((acc, l) => acc + l.cards.length, 0)),
  );

  const maxLists = Math.max(1, ...boards.map((b) => b.lists.length));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Project Progress
        </p>
        <div className="flex items-center gap-3">
          <LegendDot color="bg-[#1e2757]" label="Lists" />
          <LegendDot color="bg-orange-500" label="Cards" />
        </div>
      </div>

      {boards.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No boards yet</p>
      ) : (
        <div className="space-y-4">
          {boards.map((board, idx) => {
            const cardCount = board.lists.reduce(
              (acc, l) => acc + l.cards.length,
              0,
            );
            const cardPct = (cardCount / maxCards) * 100;
            const listPct = (board.lists.length / maxLists) * 100;

            return (
              <div key={board.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {board.title}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {cardCount} cards · {board.lists.length} lists
                  </span>
                </div>
                <div className="relative h-6 bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden">
                  {/* Lists bar (navy) */}
                  <div
                    className="absolute inset-y-1 left-0 rounded"
                    style={{
                      width: `${listPct}%`,
                      backgroundColor: "#1e2757",
                      opacity: 0.85,
                    }}
                  />
                  {/* Cards bar (orange) */}
                  <div
                    className="absolute inset-y-2 rounded"
                    style={{
                      left: `${Math.min(listPct, 90)}%`,
                      width: `${Math.max(cardPct * 0.4, 4)}%`,
                      backgroundColor: "#f97316",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <span className="text-[11px] text-gray-500 dark:text-gray-400">
      {label}
    </span>
  </div>
);

/* ============================ CATEGORIES (DONUT) ============================ */
const CategoriesCard = ({ data }) => {
  const top = data.slice(0, 5);
  const rest = data.slice(5);
  const restCount = rest.reduce((acc, d) => acc + d.count, 0);
  const shown =
    restCount > 0 ? [...top, { label: "Other", count: restCount }] : top;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Project Categories
      </p>

      {shown.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">
          No labels used yet
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <DonutChart data={shown} size={140} thickness={22} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">
                {shown.reduce((a, b) => a + b.count, 0)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">tags</p>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            {shown.map((d, i) => (
              <div
                key={d.label}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {d.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 shrink-0">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================ WORKING HOURS (BAR CHART) ============================ */
const WorkingHoursCard = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.count));
  const accentColors = {
    Mon: "#f97316",
    Tue: "#0ea5e9",
    Wed: "#1e2757",
    Thu: "#8b5cf6",
    Fri: "#10b981",
    Sat: "#f43f5e",
    Sun: "#facc15",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Tasks By Day
      </p>

      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${Math.max((d.count / max) * 100, 4)}%`,
                  backgroundColor: accentColors[d.day],
                }}
                title={`${d.count} tasks`}
              />
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================ VELOCITY (GROUPED BARS) ============================ */
const VelocityCard = ({ data }) => {
  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.done, d.inProgress, d.total)),
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Velocity
        </p>
        <div className="flex gap-2">
          <LegendDot color="bg-emerald-500" label="Done" />
          <LegendDot color="bg-orange-500" label="Active" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-1.5 h-40">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="w-full flex-1 flex items-end justify-center gap-0.5">
              {/* Done */}
              <div
                className="flex-1 rounded-t-sm bg-emerald-500 min-h-[3px]"
                style={{ height: `${Math.max((d.done / max) * 100, 2)}%` }}
                title={`${d.done} done`}
              />
              {/* In Progress */}
              <div
                className="flex-1 rounded-t-sm bg-orange-500 min-h-[3px]"
                style={{
                  height: `${Math.max((d.inProgress / max) * 100, 2)}%`,
                }}
                title={`${d.inProgress} in progress`}
              />
            </div>
            <span className="text-[9px] text-gray-400 whitespace-nowrap">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
