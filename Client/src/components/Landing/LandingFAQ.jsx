import React, { useState } from "react";

const FAQS = [
  {
    q: "Do I need an account to use Vellum?",
    a: "No! Vellum works fully offline with no signup required. Your boards and tasks are saved directly in your browser's Local Storage.",
  },
  {
    q: "Where is my data stored?",
    a: "Everything lives in your browser — nothing is sent to a server. You can export your data as JSON anytime from the Settings page for safekeeping.",
  },
  {
    q: "Can I use Vellum with my team?",
    a: "Real-time team collaboration is coming soon on the Team plan. For now, you can export your board and share the JSON with teammates.",
  },
  {
    q: "What happens if I clear my browser data?",
    a: "Your boards will be lost unless you've exported them first. Head to Settings → Data to download a JSON backup regularly.",
  },
  {
    q: "Is Vellum really free?",
    a: "The Free plan is free forever with unlimited boards, cards, and views. Pro and Team plans unlock cloud sync and collaboration.",
  },
];

const LandingFAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Questions, answered
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
