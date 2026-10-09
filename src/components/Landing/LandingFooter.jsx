import React from "react";
import { Link } from "react-router-dom";

const LandingFooter = () => (
  <footer className="border-t border-gray-100 dark:border-slate-800 py-12">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1e2757] flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              Vellum
            </span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            A local-first Kanban board for focused teams.
          </p>
        </div>

        {/* Columns */}
        <FooterCol
          title="Product"
          links={[
            { label: "Features", href: "#features" },
            { label: "Preview", href: "#preview" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ]}
        />
        <FooterCol
          title="App"
          links={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Calendar", to: "/calendar" },
            { label: "Analytics", to: "/analytics" },
            { label: "Settings", to: "/settings" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "License", href: "#" },
          ]}
        />
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Vellum. Built with React, Vite, and
          Tailwind.
        </p>
        <div className="flex gap-4">
          {["Twitter", "GitHub", "Discord"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
      {title}
    </h4>
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          {l.to ? (
            <Link
              to={l.to}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {l.label}
            </Link>
          ) : (
            <a
              href={l.href}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {l.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default LandingFooter;
