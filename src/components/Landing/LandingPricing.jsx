import React from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    price: "0 Birr",
    period: "forever",
    description: "Perfect for personal projects.",
    features: [
      "Unlimited boards",
      "Unlimited cards",
      "Calendar & analytics",
      "Local-only storage",
      "Dark mode",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "1200 Birr",
    period: "per month",
    description: "For freelancers and power users.",
    features: [
      "Everything in Free",
      "Cloud sync across devices",
      "Unlimited file attachments",
      "Priority email support",
      "Advanced analytics",
    ],
    cta: "Coming Soon",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "2500 Birr",
    period: "per user / month",
    description: "For small teams that ship together.",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Team roles & permissions",
      "Board comments & mentions",
      "SSO & audit logs",
    ],
    cta: "Coming Soon",
    highlighted: false,
  },
];

const LandingPricing = () => (
  <section id="pricing" className="py-20 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
          Pricing
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
          Start for free, upgrade when you're ready. No credit card required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-6 lg:p-8 ${
              plan.highlighted
                ? "bg-[#1e2757] text-white shadow-2xl shadow-[#1e2757]/30 scale-105 lg:scale-110"
                : "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {plan.badge}
              </div>
            )}

            <h3
              className={`text-lg font-semibold ${
                plan.highlighted
                  ? "text-white"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {plan.name}
            </h3>
            <p
              className={`text-xs mt-1 ${
                plan.highlighted
                  ? "text-white/70"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {plan.description}
            </p>

            <div className="mt-6 mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span
                className={`text-sm ml-2 ${
                  plan.highlighted ? "text-white/70" : "text-gray-500"
                }`}
              >
                /{plan.period}
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlighted ? "text-orange-400" : "text-orange-500"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span
                    className={
                      plan.highlighted
                        ? "text-white/90"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to={plan.cta === "Get Started" ? "/dashboard" : "#"}
              className={`block text-center text-sm font-medium py-3 rounded-xl transition-colors ${
                plan.highlighted
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : plan.cta === "Coming Soon"
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-[#1e2757] hover:bg-[#151c45] text-white"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingPricing;
