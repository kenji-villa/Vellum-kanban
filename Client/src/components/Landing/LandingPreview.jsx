import React, { useEffect, useState } from "react";
import { FiSearch, FiArrowUp } from "react-icons/fi";
import Reveal from "./Reveal";

const QUERIES = [
  "@me due:today",
  "is:overdue #bug",
  "priority:high is:review",
  "summer plan",
];

const RESULTS = [
  [
    { t: "Fix the checkout crash", b: "Website · To Do", chip: "Today" },
    { t: "Send the invoice", b: "Admin · In Progress", chip: "Today" },
  ],
  [
    {
      t: "Notifications arrive twice",
      b: "App · In Progress",
      chip: "Overdue",
    },
    { t: "Broken avatar upload", b: "App · To Do", chip: "Overdue" },
  ],
  [
    { t: "Pricing page copy", b: "Marketing · In review", chip: "Fri" },
    { t: "Launch checklist", b: "Website · In review", chip: "Mon" },
  ],
  [
    { t: "Summer plan", b: "Personal · In Progress", chip: "Jul 7" },
    { t: "Summer sale banner", b: "Marketing · To Do", chip: "Jun 28" },
  ],
];

// Types each example, pauses, deletes it, then moves to the next
const useTypewriter = () => {
  const [state, setState] = useState({ text: "", index: 0 });

  useEffect(() => {
    let i = 0;
    let pos = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const full = QUERIES[i];
      pos += deleting ? -1 : 1;
      setState({ text: full.slice(0, pos), index: i });

      let delay = deleting ? 28 : 65;
      if (!deleting && pos === full.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && pos === 0) {
        deleting = false;
        i = (i + 1) % QUERIES.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, []);

  return state;
};

const LandingPreview = () => {
  const { text, index } = useTypewriter();

  return (
    <section id="search" className="py-6 lg:py-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e2757] via-[#171f4a] to-[#0f1738] px-6 py-14 lg:px-16 lg:py-20 text-white">
            <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[var(--accent)] opacity-30 blur-3xl pointer-events-none" />
            <div className="absolute -left-24 bottom-0 w-72 h-72 rounded-full bg-indigo-400 opacity-20 blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] mb-4">
                  SEARCH
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  Search that speaks{" "}
                  <span className="italic font-serif text-orange-300">
                    your language
                  </span>
                </h2>
                <p className="mt-5 text-white/70 leading-relaxed">
                  Type a few words, or add a filter. Ask for what's assigned to
                  you, what's overdue or what's waiting for review, and Vellum
                  finds it across every board.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "@me",
                    "#label",
                    "due:today",
                    "is:overdue",
                    "priority:high",
                  ].map((c) => (
                    <span
                      key={c}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 rounded-2xl bg-white text-gray-900 px-4 py-3.5 shadow-2xl">
                  <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="flex-1 text-sm">
                    {text}
                    <span className="inline-block w-px h-4 bg-gray-800 align-middle ml-0.5 animate-caret" />
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-[#1e2757] text-white flex items-center justify-center">
                    <FiArrowUp className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-3 rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-2">
                  {RESULTS[index].map((r) => (
                    <div
                      key={r.t}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{r.t}</p>
                        <p className="text-[11px] text-white/50">{r.b}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15">
                        {r.chip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default LandingPreview;
