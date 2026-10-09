import React from "react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager at Northwind",
    initials: "SC",
    color: "bg-blue-500",
    quote:
      "Vellum replaced three tools for us. The calendar + Kanban combo is exactly what our team needed.",
  },
  {
    name: "Marcus Lee",
    role: "Freelance Developer",
    initials: "ML",
    color: "bg-teal-500",
    quote:
      "No signup, no servers, all local. It's the only productivity app I trust with my client work.",
  },
  {
    name: "Priya Nair",
    role: "Design Lead at Framer",
    initials: "PN",
    color: "bg-orange-500",
    quote:
      "The drag-and-drop feels so smooth. My team stopped using Trello the same week we found Vellum.",
  },
];

const LandingTestimonials = () => (
  <section className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
          Loved by teams
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          What people are saying
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-orange-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingTestimonials;
