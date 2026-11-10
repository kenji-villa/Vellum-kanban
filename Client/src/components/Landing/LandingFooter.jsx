import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiArrowUp } from "react-icons/fi";

const LandingFooter = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  // Section anchors only exist on the home page, so elsewhere they go home
  const section = (t, hash) => (onHome ? { t, href: hash } : { t, to: "/" });

  const COLS = [
    {
      title: "Product",
      links: [
        section("Features", "#features"),
        section("Search", "#search"),
        section("Why Vellum", "#perks"),
      ],
    },
    { title: "Help", links: [section("FAQ", "#faq")] },
    {
      title: "Legal",
      links: [
        { t: "Terms of Service", to: "/terms" },
        { t: "Privacy Policy", to: "/privacy" },
      ],
    },
    {
      title: "Account",
      links: [
        { t: "Sign in", to: "/login" },
        { t: "Create an account", to: "/signup" },
      ],
    },
  ];

  const linkCls = "text-sm text-white/70 hover:text-white transition-colors";

  return (
    <footer className="relative mt-16 overflow-hidden text-white">
      {/* Blue base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e2757] via-[#26358f] to-[#3b5bdb]" />
      {/* The page colour fades into the blue */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white dark:from-[#0f172a] to-transparent" />
      {/* White light spilling in from the top */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[340px] rounded-full bg-white/30 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-sky-300/25 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-24 w-[360px] h-[360px] rounded-full bg-indigo-300/20 blur-[110px] pointer-events-none" />
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-48 pb-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Brand + call to action */}
          <div className="lg:col-span-5">
            <img
              src="/Logo2.png"
              alt="Vellum"
              className="h-11 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-5 max-w-sm text-white/70 leading-relaxed">
              A calm Kanban workspace for teams that want to plan together and
              ship faster.
            </p>
            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 bg-white text-[#1e2757] text-sm font-semibold px-6 py-3 rounded-xl shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-transform"
            >
              Get started free <FiArrowRight />
            </Link>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLS.map((c) => (
              <div key={c.title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">
                  {c.title}
                </h4>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.t}>
                      {l.to ? (
                        <Link to={l.to} className={linkCls}>
                          {l.t}
                        </Link>
                      ) : (
                        <a href={l.href} className={linkCls}>
                          {l.t}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Vellum. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Back to top"
            >
              <FiArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Giant faded wordmark, cropped by the bottom edge */}
      <div
        aria-hidden="true"
        className="relative select-none pointer-events-none text-center font-extrabold tracking-tighter leading-[0.8] text-[22vw] lg:text-[15rem] bg-gradient-to-b from-white/35 via-white/10 to-transparent bg-clip-text text-transparent -mb-5 lg:-mb-9"
      >
        Vellum
      </div>
    </footer>
  );
};

export default LandingFooter;
