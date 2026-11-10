import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMessageSquare, FiArrowRight } from "react-icons/fi";
import { LABEL_COLORS } from "../../utils/labels";

const DOT = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

// Sample tasks (clearly demo content)
const ROW_1 = [
  {
    p: "high",
    label: "Bug",
    color: "red",
    title: "Fix the checkout crash",
    due: "Today",
    who: "AM",
    bg: "bg-sky-500",
    c: 3,
  },
  {
    p: "medium",
    label: "Design",
    color: "pink",
    title: "New onboarding screens",
    due: "Fri",
    who: "SK",
    bg: "bg-violet-500",
    c: 5,
  },
  {
    p: "low",
    label: "Research",
    color: "orange",
    title: "Interview three customers",
    due: "Next week",
    who: "DT",
    bg: "bg-teal-500",
    c: 1,
  },
  {
    p: "high",
    label: "Development",
    color: "blue",
    title: "Ship the API rate limiter",
    due: "Tomorrow",
    who: "LB",
    bg: "bg-rose-500",
    c: 8,
  },
  {
    p: "medium",
    label: "Marketing",
    color: "yellow",
    title: "Plan the launch email",
    due: "Mon",
    who: "NG",
    bg: "bg-amber-500",
    c: 2,
  },
  {
    p: "low",
    label: "UI",
    color: "purple",
    title: "Polish the empty states",
    due: "Thu",
    who: "RT",
    bg: "bg-indigo-500",
    c: 0,
  },
];
const ROW_2 = [
  {
    p: "medium",
    label: "Development",
    color: "blue",
    title: "Migrate the database",
    due: "Wed",
    who: "TH",
    bg: "bg-emerald-500",
    c: 4,
  },
  {
    p: "high",
    label: "Bug",
    color: "red",
    title: "Notifications arrive twice",
    due: "Today",
    who: "AM",
    bg: "bg-sky-500",
    c: 6,
  },
  {
    p: "low",
    label: "System",
    color: "gray",
    title: "Rotate the API keys",
    due: "Sun",
    who: "KY",
    bg: "bg-pink-500",
    c: 1,
  },
  {
    p: "medium",
    label: "Design",
    color: "pink",
    title: "Icon set for the sidebar",
    due: "Tue",
    who: "SK",
    bg: "bg-violet-500",
    c: 3,
  },
  {
    p: "high",
    label: "Research",
    color: "orange",
    title: "Compare pricing models",
    due: "Tomorrow",
    who: "DT",
    bg: "bg-teal-500",
    c: 7,
  },
  {
    p: "low",
    label: "Marketing",
    color: "yellow",
    title: "Collect launch feedback",
    due: "Next week",
    who: "NG",
    bg: "bg-amber-500",
    c: 2,
  },
];

const TaskChip = ({ t }) => (
  <div className="w-64 shrink-0 mr-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-4 text-left">
    <div className="flex items-center gap-2 mb-2">
      <span className={`w-2 h-2 rounded-full ${DOT[t.p]}`} />
      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {t.p}
      </span>
      <span
        className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${LABEL_COLORS[t.color].pill}`}
      >
        {t.label}
      </span>
    </div>
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
      {t.title}
    </p>
    <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400">
      <span className="inline-flex items-center gap-1">
        <FiCalendar className="w-3 h-3" /> {t.due}
      </span>
      <span className="inline-flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <FiMessageSquare className="w-3 h-3" /> {t.c}
        </span>
        <span
          className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${t.bg}`}
        >
          {t.who}
        </span>
      </span>
    </div>
  </div>
);

const Marquee = ({ items, reverse = false, duration = 50 }) => (
  <div className="marquee mask-fade-x overflow-hidden">
    <div
      className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {[...items, ...items].map((t, i) => (
        <TaskChip key={i} t={t} />
      ))}
    </div>
  </div>
);

const LandingHero = () => (
  <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40">
    {/* Backdrop: dots, glows and a soft wave */}
    <div
      className="absolute inset-0 opacity-60 dark:opacity-30 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(rgba(30,39,87,0.18) 1px, transparent 1.4px)",
        backgroundSize: "26px 26px",
        WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 75%)",
        maskImage: "linear-gradient(to bottom, #000, transparent 75%)",
      }}
    />
    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-[var(--accent)]/15 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute top-40 -left-32 w-[420px] h-[420px] bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />
    <svg
      className="absolute inset-x-0 bottom-0 w-full h-72 pointer-events-none"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroWave" x1="0" x2="1">
          <stop offset="0%" stopColor="#1e2757" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path
        fill="url(#heroWave)"
        d="M0,192 C240,96 480,288 720,200 C960,112 1200,240 1440,150 L1440,320 L0,320 Z"
      />
    </svg>

    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
      {/* Announcement pill */}
      <a
        href="#features"
        className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-sm mb-8 animate-fade-up delay-100 hover:shadow-md transition-shadow"
      >
        <span className="bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          NEW
        </span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Live sync, reviews and comments are here
        </span>
        <FiArrowRight className="w-3 h-3 text-gray-400" />
      </a>

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.05] animate-blur-reveal delay-200">
        Plan together.
        <br />
        <span className="relative inline-block">
          <span className="italic font-serif bg-gradient-to-r from-[#1e2757] via-[var(--accent)] to-[#1e2757] bg-clip-text text-transparent dark:from-orange-300 dark:via-orange-400 dark:to-orange-300">
            Ship faster.
          </span>
          <svg
            className="absolute -bottom-2 left-0 w-full h-3 text-[var(--accent)]"
            viewBox="0 0 300 12"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M2 8 C60 2, 120 12, 180 6 S270 4, 298 8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-up delay-300">
        Vellum is a calm Kanban workspace for teams. Share boards, hand out
        tasks, review the work and watch every change land live, all in one
        place.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-400">
        <Link
          to="/signup"
          className="bg-[#1e2757] hover:bg-[#151c45] text-white text-sm font-medium px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#1e2757]/25"
        >
          Get started free
        </Link>
        <a
          href="#features"
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-7 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          See how it works
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-400 animate-fade-up delay-500">
        Free to use · Sign in with email or Google
      </p>
    </div>

    {/* Marquee of sample tasks */}
    <div className="relative mt-16 lg:mt-20 space-y-4 animate-fade-up delay-500">
      <Marquee items={ROW_1} duration={55} />
      <Marquee items={ROW_2} reverse duration={65} />
    </div>
  </section>
);

export default LandingHero;
