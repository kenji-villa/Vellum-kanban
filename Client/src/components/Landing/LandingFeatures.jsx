import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiColumns,
  FiUsers,
  FiCheckCircle,
  FiMessageSquare,
  FiZap,
  FiSearch,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";
import Reveal from "./Reveal";
import {
  Frame,
  BoardsMock,
  TeamMock,
  ReviewMock,
  ActivityMock,
  LiveMock,
  SearchMock,
  InsightsMock,
} from "./LandingMocks";

const FEATURES = [
  {
    id: "boards",
    icon: FiColumns,
    tab: "Boards",
    frame: "vellum.app · Boards",
    Mock: BoardsMock,
    title: "Boards that stay out of your way",
    desc: "Lay your work out in lists, drag cards where they belong, and tag everything with priorities, due dates and labels you invent yourself.",
    bullets: [
      ["Drag and drop", "Reorder cards and lists with one smooth motion."],
      [
        "Your own labels",
        "Create colour-coded labels that the whole board shares.",
      ],
      ["Due dates and priorities", "See at a glance what matters most today."],
    ],
  },
  {
    id: "team",
    icon: FiUsers,
    tab: "Teams",
    frame: "vellum.app · Share",
    Mock: TeamMock,
    title: "Bring your people in",
    desc: "Find teammates by name or email, invite them, and share any board with exactly the access they need.",
    bullets: [
      [
        "Invite by name or email",
        "Peek at a profile first if two people share a name.",
      ],
      [
        "Editor or view-only",
        "Let stakeholders follow along without touching anything.",
      ],
      [
        "You stay in control",
        "Change a role or remove someone whenever you like.",
      ],
    ],
  },
  {
    id: "review",
    icon: FiCheckCircle,
    tab: "Reviews",
    badge: "NEW",
    frame: "vellum.app · Task",
    Mock: ReviewMock,
    title: "Assign it. Submit it. Approve it.",
    desc: "Hand a task to a teammate, let them submit it for review with a note, and approve or send it back, with everyone notified along the way.",
    bullets: [
      ["Clear ownership", "Every task can have an assignee and a reviewer."],
      ["Submit with a note", "Say what changed so the review is quick."],
      ["Done means done", "Finished tasks stop showing up as urgent."],
    ],
  },
  {
    id: "activity",
    icon: FiMessageSquare,
    tab: "Comments",
    frame: "vellum.app · Activity",
    Mock: ActivityMock,
    title: "Talk about the work, where it lives",
    desc: "Comment right on the task and see what happened to it: moves, due-date changes, reassignments and reviews, in one timeline.",
    bullets: [
      [
        "Comments on every task",
        "Keep decisions next to the work, not buried in chat.",
      ],
      ["An automatic history", "Every change is logged with who and when."],
      [
        "A board-wide feed",
        "Catch up on everything that moved while you were away.",
      ],
    ],
  },
  {
    id: "live",
    icon: FiZap,
    tab: "Live sync",
    badge: "NEW",
    frame: "vellum.app · Live",
    Mock: LiveMock,
    title: "See changes the moment they happen",
    desc: "When a teammate moves a card, comments or assigns you something, it shows up on your screen right away, with no refresh and no waiting.",
    bullets: [
      ["Instant updates", "Boards, comments and notifications arrive live."],
      [
        "Smart notifications",
        "A bell for invitations, assignments and deadlines.",
      ],
      ["Never overwrites you", "Updates wait while you drag or type."],
    ],
  },
  {
    id: "search",
    icon: FiSearch,
    tab: "Search",
    frame: "vellum.app · Search",
    Mock: SearchMock,
    title: "Find anything. Jump anywhere.",
    desc: "One search box finds boards, tasks and people. Add small filters like @me or due:today, or press Ctrl + K to run commands from the keyboard.",
    bullets: [
      ["Filters that read like words", "@me, #label, due:today, is:overdue."],
      [
        "A command palette",
        "Open pages, boards and actions without the mouse.",
      ],
      ["Keyboard shortcuts", "Go to any page with two keystrokes."],
    ],
  },
  {
    id: "insights",
    icon: FiBarChart2,
    tab: "Insights",
    frame: "vellum.app · Dashboard",
    Mock: InsightsMock,
    title: "Know where things stand",
    desc: "A dashboard, calendar and analytics show what is done, what is late and what is coming, plus alerts before a deadline slips.",
    bullets: [
      [
        "Deadline alerts",
        "Overdue, due today, due tomorrow, before it's too late.",
      ],
      ["Calendar view", "Your tasks laid out by day."],
      ["Progress at a glance", "Every board shows how much is finished."],
    ],
  },
];

const LandingFeatures = () => {
  const [active, setActive] = useState("boards");
  const f = FEATURES.find((x) => x.id === active) || FEATURES[0];

  // The nav's Product menu can switch the tab
  useEffect(() => {
    const onTab = (e) =>
      FEATURES.some((x) => x.id === e.detail) && setActive(e.detail);
    window.addEventListener("landing:tab", onTab);
    return () => window.removeEventListener("landing:tab", onTab);
  }, []);

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-3">
            Everything in one place
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            One workspace for every step of the work
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            From the first idea to the final review, Vellum keeps the whole team
            on the same page.
          </p>
        </Reveal>

        {/* Icon tiles */}
        <Reveal>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {FEATURES.map((x) => {
              const on = x.id === active;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setActive(x.id)}
                  className={`group relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border transition-all ${
                    on
                      ? "bg-white dark:bg-slate-800 border-[var(--accent)] shadow-xl shadow-[var(--accent-ring)] -translate-y-1"
                      : "bg-white/60 dark:bg-slate-800/40 border-gray-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  {x.badge && (
                    <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white">
                      {x.badge}
                    </span>
                  )}
                  <span
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      on
                        ? "bg-gradient-to-br from-[#1e2757] to-[#3a4a9c] text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 group-hover:text-[var(--accent)]"
                    }`}
                  >
                    <x.icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {x.tab}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active panel */}
        <div
          key={f.id}
          className="mt-12 grid lg:grid-cols-5 gap-10 items-center animate-fade-in"
        >
          <div className="lg:col-span-2">
            {f.badge && (
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-white mb-3">
                {f.badge}
              </span>
            )}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              {f.title}
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {f.desc}
            </p>
            <Link
              to="/signup"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:gap-3 transition-all"
            >
              Try it free <FiArrowRight />
            </Link>
          </div>
          <div className="lg:col-span-3">
            <Frame title={f.frame}>
              <f.Mock />
            </Frame>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {f.bullets.map(([t, d]) => (
            <div
              key={t}
              className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
