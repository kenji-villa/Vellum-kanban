import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Is Vellum free?",
    a: "Yes. Vellum is free to use while it's in active development, with no credit card needed.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. You can sign up with your email or continue with Google. An account is what lets you share boards with your team and see them on any device.",
  },
  {
    q: "Where is my data stored, and can I take it with me?",
    a: "Your boards, tasks and comments are stored on the Vellum server under your account. From Settings → Data you can download a full backup (JSON), export your tasks as a spreadsheet, import a backup, or delete your account and everything you own.",
  },
  {
    q: "Can I work with my team?",
    a: "Yes. Invite teammates by name or email, then share any board with them as an editor or as view-only. Editors can add, move and comment on tasks, while viewers can read everything but change nothing.",
  },
  {
    q: "Do changes show up live for everyone?",
    a: "They do. When a teammate moves a card, comments or assigns you a task, it appears on your screen straight away, and the bell lets you know.",
  },
  {
    q: "How do reviews work?",
    a: "Whoever assigns a task becomes its reviewer. The assignee submits it with an optional note, and the reviewer approves it or asks for changes. Either way, both people are notified.",
  },
];

const LandingFAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-3">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Questions, answered
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {f.q}
                    </span>
                    <FiPlus
                      className={`w-5 h-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
