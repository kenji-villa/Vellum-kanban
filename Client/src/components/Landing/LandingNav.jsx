import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiColumns,
  FiUsers,
  FiCheckCircle,
  FiMessageSquare,
  FiZap,
  FiSearch,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

const PRODUCT = [
  {
    id: "boards",
    icon: FiColumns,
    title: "Boards",
    desc: "Drag-and-drop Kanban with labels",
  },
  {
    id: "team",
    icon: FiUsers,
    title: "Teams & sharing",
    desc: "Invite people and set their role",
  },
  {
    id: "review",
    icon: FiCheckCircle,
    title: "Assign & review",
    desc: "Submit, approve, request changes",
  },
  {
    id: "activity",
    icon: FiMessageSquare,
    title: "Comments & activity",
    desc: "Talk where the work lives",
  },
  {
    id: "live",
    icon: FiZap,
    title: "Live sync",
    desc: "Changes appear instantly",
  },
  {
    id: "search",
    icon: FiSearch,
    title: "Search & shortcuts",
    desc: "Ctrl + K and smart filters",
  },
];

// Switch the feature tab, then scroll to the section (home page only)
const goTo = (id) => {
  window.dispatchEvent(new CustomEvent("landing:tab", { detail: id }));
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
};

const LandingNav = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };

  const link = (active = false) =>
    `text-sm font-medium transition-colors ${
      active
        ? "text-[var(--accent)]"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menu
          ? "bg-white/85 dark:bg-[#0f172a]/85 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/Logo2.png"
              alt="Vellum"
              className="h-11 w-auto object-contain"
            />
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8">
            {onHome ? (
              <>
                <div
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <button
                    type="button"
                    className={`${link()} inline-flex items-center gap-1`}
                    onClick={() => setMega((v) => !v)}
                  >
                    Product
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform ${mega ? "rotate-180" : ""}`}
                    />
                  </button>

                  {mega && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 animate-fade-in">
                      <div className="w-[34rem] grid grid-cols-2 gap-1 p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-gray-100 dark:border-slate-700">
                        {PRODUCT.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setMega(false);
                              goTo(p.id);
                            }}
                            className="flex items-start gap-3 p-3 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-colors"
                          >
                            <span className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                              <p.icon className="w-4 h-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {p.title}
                              </span>
                              <span className="block text-xs text-gray-500 dark:text-gray-400">
                                {p.desc}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <a href="#perks" className={link()}>
                  Why Vellum
                </a>
              </>
            ) : (
              <Link to="/" className={link()}>
                Home
              </Link>
            )}
            <Link to="/terms" className={link(pathname === "/terms")}>
              Terms of Service
            </Link>
            <Link to="/privacy" className={link(pathname === "/privacy")}>
              Privacy Policy
            </Link>
          </div>

          {/* Right: CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className={link()}>
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-[#1e2757] hover:bg-[#151c45] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#1e2757]/20"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 dark:text-gray-200"
            onClick={() => setMenu((v) => !v)}
            aria-label="Menu"
          >
            {menu ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {menu && (
          <div className="md:hidden pb-5 space-y-1">
            {onHome ? (
              PRODUCT.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    goTo(p.id);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left text-sm text-gray-700 dark:text-gray-200"
                >
                  <p.icon className="w-4 h-4 text-[var(--accent)]" />
                  {p.title}
                </button>
              ))
            ) : (
              <Link
                to="/"
                onClick={() => setMenu(false)}
                className="block px-2 py-2.5 text-sm text-gray-700 dark:text-gray-200"
              >
                Home
              </Link>
            )}
            <Link
              to="/terms"
              onClick={() => setMenu(false)}
              className="block px-2 py-2.5 text-sm text-gray-700 dark:text-gray-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMenu(false)}
              className="block px-2 py-2.5 text-sm text-gray-700 dark:text-gray-200"
            >
              Privacy Policy
            </Link>
            <div className="flex gap-3 pt-3">
              <Link
                to="/login"
                className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center text-sm font-medium py-2.5 rounded-xl bg-[#1e2757] text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNav;
