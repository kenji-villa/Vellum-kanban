import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLayers,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import PersonAvatar from "../components/Team/PersonAvatar";
import { useBoard } from "../context/BoardContext";
import { useAuth } from "../context/AuthContext";
import { LABEL_HEX } from "../utils/labels";
import {
  buildTasks,
  buildPeople,
  weeklyThroughput,
  workload,
  needsAttention,
  boardStats,
  labelStats,
} from "../utils/analytics";

const CATEGORY = [
  { key: "done", label: "Done", color: "#10b981" },
  { key: "review", label: "In review", color: "#f59e0b" },
  { key: "progress", label: "In progress", color: "#3b82f6" },
  { key: "todo", label: "To do", color: "#94a3b8" },
];

const PRIORITY = [
  { key: "high", label: "High", color: "#ef4444" },
  { key: "medium", label: "Medium", color: "#eab308" },
  { key: "low", label: "Low", color: "#22c55e" },
];

const TONES = {
  navy: "bg-[#1e2757] text-white",
  green: "bg-emerald-500 text-white",
  red: "bg-red-500 text-white",
  amber: "bg-amber-500 text-white",
};

const dueText = (d) =>
  d < 0
    ? `Overdue by ${-d}d`
    : d === 0
      ? "Due today"
      : d === 1
        ? "Due tomorrow"
        : `Due in ${d} days`;

const selectCls =
  "text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]";

/* ---------- small building blocks ---------- */
const Panel = ({ title, right, children, className = "", delay = 0 }) => (
  <section
    className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 animate-rise ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h2>
      {right}
    </div>
    {children}
  </section>
);

const Empty = ({ text }) => (
  <p className="text-xs text-gray-400 text-center py-8">{text}</p>
);

const Kpi = ({ icon: Icon, label, value, sub, tone, delay }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 animate-rise"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <span
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${TONES[tone]}`}
      >
        <Icon className="w-4 h-4" />
      </span>
    </div>
    <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-gray-100 leading-none">
      {value}
    </p>
    <p className="mt-2 text-[11px] text-gray-400">{sub}</p>
  </div>
);

const Ring = ({ segments, size = 150, thickness = 20, center, sub }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          className="stroke-gray-100 dark:stroke-slate-700"
        />
        {total > 0 &&
          segments
            .filter((s) => s.value > 0)
            .map((s) => {
              const len = (s.value / total) * C;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">
          {center}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
};

const Legend = ({ color, label }) => (
  <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
    {label}
  </span>
);

/* ---------- widgets ---------- */
const Throughput = ({ data, weeks }) => {
  const max = Math.max(1, ...data.flatMap((d) => [d.created, d.completed]));
  const created = data.reduce((a, d) => a + d.created, 0);
  const completed = data.reduce((a, d) => a + d.completed, 0);
  return (
    <Panel
      title="Throughput"
      className="lg:col-span-2"
      delay={160}
      right={
        <div className="flex gap-3">
          <Legend color="#1e2757" label="Created" />
          <Legend color="#10b981" label="Completed" />
        </div>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <b>{created}</b> created · <b>{completed}</b> completed in the last{" "}
        {weeks} weeks
      </p>
      <div className="flex items-end gap-3 h-44 mt-4">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 h-full flex flex-col items-center gap-2"
          >
            <div className="w-full flex-1 flex items-end justify-center gap-1">
              <div
                className="flex-1 max-w-[18px] rounded-t-md bg-[#1e2757] dark:bg-indigo-400"
                style={{
                  height: `${(d.created / max) * 100}%`,
                  minHeight: d.created ? 4 : 2,
                }}
                title={`${d.created} created`}
              />
              <div
                className="flex-1 max-w-[18px] rounded-t-md bg-emerald-500"
                style={{
                  height: `${(d.completed / max) * 100}%`,
                  minHeight: d.completed ? 4 : 2,
                }}
                title={`${d.completed} completed`}
              />
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {d.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-gray-400">
        Tasks in a Done list without a recorded completion time are dated by
        their last update.
      </p>
    </Panel>
  );
};

const StatusPanel = ({ data }) => {
  const segs = CATEGORY.map((c) => ({ ...c, value: data[c.key] }));
  return (
    <Panel title="Status" delay={200}>
      <div className="flex items-center gap-6 flex-wrap">
        <Ring segments={segs} center={`${data.rate}%`} sub="completed" />
        <ul className="flex-1 min-w-[8rem] space-y-2.5">
          {segs.map((s) => (
            <li
              key={s.key}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {s.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
};

const BoardProgress = ({ rows, onOpen }) => (
  <Panel title="Boards" className="lg:col-span-2" delay={240}>
    {rows.length === 0 ? (
      <Empty text="No boards yet" />
    ) : (
      <ul className="space-y-5">
        {rows.map(({ board, total, done, overdue, review, pct }) => {
          const people = [board.owner, ...(board.members || [])].filter(
            (p) => p?.name,
          );
          return (
            <li key={board.id}>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => onOpen(board.id)}
                  className="text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-[var(--accent)] truncate text-left"
                >
                  {board.title}
                </button>
                {board.role === "viewer" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500">
                    View only
                  </span>
                )}
                {board.role === "editor" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500">
                    Shared
                  </span>
                )}
                {overdue > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                    {overdue} overdue
                  </span>
                )}
                {review > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {review} in review
                  </span>
                )}
                <div className="ml-auto flex -space-x-2 shrink-0">
                  {people.slice(0, 4).map((p) => (
                    <span key={p.id} title={p.name}>
                      <PersonAvatar user={p} size={22} ring />
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-24 text-right text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {done}/{total} done
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </Panel>
);

const Attention = ({ rows, onOpen }) => (
  <Panel title="Needs attention" delay={280}>
    {rows.length === 0 ? (
      <Empty text="Nothing overdue or due in the next 3 days 🎉" />
    ) : (
      <ul className="space-y-1 -mx-2">
        {rows.map((t) => (
          <li key={t.card.id}>
            <button
              type="button"
              onClick={() => onOpen(t)}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-slate-700/50"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${t.overdue ? "bg-red-500" : "bg-amber-400"}`}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {t.card.title}
                </span>
                <span className="block text-[11px] text-gray-400 truncate">
                  {t.board.title} · {t.list.title}
                </span>
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  t.overdue
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {dueText(t.days)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </Panel>
);

const Workload = ({ rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.open));
  return (
    <Panel title="Workload" delay={320}>
      {rows.length === 0 ? (
        <Empty text="No open tasks" />
      ) : (
        <ul className="space-y-4">
          {rows.slice(0, 6).map((r) => (
            <li key={r.id} className="flex items-center gap-3">
              {r.person ? (
                <PersonAvatar user={r.person} size={28} />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-600 text-[11px] font-bold text-gray-500 flex items-center justify-center shrink-0">
                  {r.name === "Unassigned" ? "?" : r.name[0]}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="truncate text-gray-700 dark:text-gray-200">
                    {r.name}
                  </span>
                  <span className="text-gray-500 shrink-0 ml-2">
                    {r.open} open{r.overdue ? ` · ${r.overdue} late` : ""}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${(r.open / max) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

const Priorities = ({ rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Panel title="Open by priority" delay={360}>
      <ul className="space-y-4">
        {rows.map((p) => (
          <li key={p.key}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-600 dark:text-gray-300">
                {p.label}
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {p.count}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(p.count / max) * 100}%`,
                  background: p.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

const Labels = ({ rows }) => {
  const top = rows.slice(0, 6);
  const max = Math.max(1, ...top.map((r) => r.count));
  return (
    <Panel title="Top labels" delay={400}>
      {top.length === 0 ? (
        <Empty text="No labels used yet" />
      ) : (
        <ul className="space-y-3.5">
          {top.map((l) => (
            <li key={l.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: LABEL_HEX[l.key] }}
                  />
                  {l.label}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {l.count}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(l.count / max) * 100}%`,
                    background: LABEL_HEX[l.key],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

/* ---------- page ---------- */
const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { state } = useBoard();
  const { user } = useAuth();

  const [boardId, setBoardId] = useState("all");
  const [weeks, setWeeks] = useState(8);
  const [mineOnly, setMineOnly] = useState(false);

  // If the selected board disappears (deleted, access removed), fall back to all
  const scope =
    boardId === "all" || state.boards.some((b) => b.id === boardId)
      ? boardId
      : "all";

  const people = useMemo(
    () => buildPeople(state.boards, user),
    [state.boards, user],
  );
  const tasks = useMemo(
    () =>
      buildTasks(state.boards, { boardId: scope, mineOnly, meId: user?.id }),
    [state.boards, scope, mineOnly, user?.id],
  );

  const data = useMemo(() => {
    const count = (cat) => tasks.filter((t) => t.category === cat).length;
    const total = tasks.length;
    const done = count("done");
    return {
      total,
      done,
      review: count("review"),
      progress: count("progress"),
      todo: count("todo"),
      overdue: tasks.filter((t) => t.overdue).length,
      waitingOnMe: tasks.filter(
        (t) => t.category === "review" && t.card.assignedById === user?.id,
      ).length,
      rate: total ? Math.round((done / total) * 100) : 0,
      throughput: weeklyThroughput(tasks, weeks),
      workload: workload(tasks, people),
      attention: needsAttention(tasks),
      boards: boardStats(tasks, state.boards, scope),
      labels: labelStats(tasks, state.boards),
      priority: PRIORITY.map((p) => ({
        ...p,
        count: tasks.filter(
          (t) => t.category !== "done" && t.card.priority === p.key,
        ).length,
      })),
    };
  }, [tasks, people, weeks, state.boards, scope, user?.id]);

  const boardCount = scope === "all" ? state.boards.length : 1;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 p-8 overflow-y-auto page-enter">
        {/* Header + filters */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Live numbers across your boards
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={scope}
              onChange={(e) => setBoardId(e.target.value)}
              className={selectCls}
              aria-label="Board"
            >
              <option value="all">All boards</option>
              {state.boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className={selectCls}
              aria-label="Time range"
            >
              <option value={4}>Last 4 weeks</option>
              <option value={8}>Last 8 weeks</option>
              <option value={12}>Last 12 weeks</option>
            </select>
            <button
              type="button"
              onClick={() => setMineOnly((v) => !v)}
              className={`text-sm font-medium rounded-xl px-4 py-2 border transition-colors ${
                mineOnly
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              My tasks
            </button>
          </div>
        </div>

        {state.loading && state.boards.length === 0 ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="space-y-5">
            {/* Headline numbers */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              <Kpi
                icon={FiLayers}
                tone="navy"
                label="Total tasks"
                value={data.total}
                sub={`across ${boardCount} board${boardCount === 1 ? "" : "s"}`}
                delay={0}
              />
              <Kpi
                icon={FiCheckCircle}
                tone="green"
                label="Completed"
                value={data.done}
                sub={`${data.rate}% completion rate`}
                delay={60}
              />
              <Kpi
                icon={FiAlertTriangle}
                tone="red"
                label="Overdue"
                value={data.overdue}
                sub={data.overdue ? "Needs attention" : "Everything is on time"}
                delay={120}
              />
              <Kpi
                icon={FiEye}
                tone="amber"
                label="In review"
                value={data.review}
                sub={`${data.waitingOnMe} waiting on you`}
                delay={180}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Throughput data={data.throughput} weeks={weeks} />
              <StatusPanel data={data} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <BoardProgress
                rows={data.boards}
                onOpen={(id) => navigate(`/board/${id}`)}
              />
              <Attention
                rows={data.attention}
                onOpen={(t) =>
                  navigate(`/board/${t.board.id}?task=${t.card.id}`)
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Workload rows={data.workload} />
              <Priorities rows={data.priority} />
              <Labels rows={data.labels} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
