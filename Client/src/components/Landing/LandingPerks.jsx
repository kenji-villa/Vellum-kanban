import React from "react";
import {
  FiZap,
  FiUsers,
  FiCommand,
  FiShield,
  FiSliders,
  FiPlay,
} from "react-icons/fi";
import Reveal from "./Reveal";

const PERKS = [
  {
    icon: FiZap,
    title: "Live by default",
    text: "Cards, comments and notifications arrive as they happen. No refreshing, no stale boards.",
  },
  {
    icon: FiUsers,
    title: "Roles that make sense",
    text: "Owners, editors and view-only members, so everyone has the right amount of access.",
  },
  {
    icon: FiCommand,
    title: "Keyboard-first",
    text: "A command palette, quick filters and two-key shortcuts for people who hate reaching for the mouse.",
  },
  {
    icon: FiShield,
    title: "Your data stays yours",
    text: "Download a full backup, import it anywhere, or delete your account whenever you want.",
  },
  {
    icon: FiSliders,
    title: "Make it yours",
    text: "Light and dark themes, your choice of accent colour and labels you invent.",
  },
  {
    icon: FiPlay,
    title: "Quick to start",
    text: "Sign in with email or Google, create a board and you're working in seconds.",
  },
];

const LandingPerks = () => (
  <section id="perks" className="py-20 lg:py-28">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <Reveal className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-3">
          Why Vellum
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Small things that add up
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Built for people who want a tool that is quick, calm and respects
          their time.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PERKS.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <div className="group h-full p-7 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-300/70 via-indigo-400/70 to-violet-500/80 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/40 group-hover:scale-105 transition-transform">
                <p.icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-gray-100">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default LandingPerks;
