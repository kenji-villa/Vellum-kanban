import React from "react";
import { Link } from "react-router-dom";

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1e2757 1px, transparent 1px), linear-gradient(to bottom, #1e2757 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
          <span className="bg-[#1e2757] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Built for teams that ship fast
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.05]">
          Your daily tasks,
          <br />
          <span className="bg-gradient-to-r from-[#1e2757] via-orange-500 to-[#1e2757] bg-clip-text text-transparent dark:from-orange-400 dark:via-orange-300 dark:to-orange-400">
            organized effortlessly.
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Vellum helps you manage daily tasks, assign teammates, and track
          progress — all in a simple, fast, and visual workspace. No accounts,
          no servers, all local.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="bg-[#1e2757] hover:bg-[#151c45] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#1e2757]/20"
          >
            Get Started — Free
          </Link>
          <a
            href="#preview"
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            View Demo
          </a>
        </div>

        {/* Product Preview Mock */}
        <div className="mt-16 lg:mt-20 relative">
          <div className="relative mx-auto max-w-5xl">
            {/* Floating notification card */}
            <div className="hidden lg:block absolute -top-6 -right-10 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-4 text-left rotate-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[11px] text-gray-500">Today</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Redesign Dashboard
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Refine header with minimal layout, icon buttons...
              </p>
              <div className="flex gap-1 mt-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  UI/UX
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Design
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  High
                </span>
              </div>
            </div>

            {/* Main Preview Card */}
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white dark:bg-slate-800 rounded-md px-3 py-1 text-[11px] text-gray-400 text-center">
                    vellum.app/dashboard
                  </div>
                </div>
              </div>

              {/* Fake dashboard */}
              <div className="flex">
                <div className="w-16 bg-[#1e2757] p-3 flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg ${
                        i === 1 ? "bg-orange-500" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1 p-5 bg-gray-50 dark:bg-slate-900">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3"
                      >
                        <div className="h-2 w-16 bg-gray-200 dark:bg-slate-700 rounded mb-3" />
                        <div className="space-y-2">
                          <div className="h-8 bg-orange-50 dark:bg-orange-900/20 rounded" />
                          <div className="h-8 bg-gray-100 dark:bg-slate-700 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Stat value="100%" label="Local-first" />
          <Stat value="0 ms" label="Setup time" />
          <Stat value="∞" label="Boards & cards" />
          <Stat value="3" label="Views built-in" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

export default LandingHero;
