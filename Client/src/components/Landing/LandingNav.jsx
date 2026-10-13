import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { name: "Features", href: "#features" },
  { name: "Preview", href: "#preview" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/Logo2.png"
              alt="Vellum"
              className="w-20 h-20 object-contain"
            />
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {l.name}
              </a>
            ))}
          </div>

          {/* Right: CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-[#1e2757] hover:bg-[#151c45] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-slate-800">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {l.name}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="mt-3 block text-center bg-[#1e2757] text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNav;
