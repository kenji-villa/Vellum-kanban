<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f172a]">
      {/* LEFT — Branded visual panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1e2757]">
        {/* Gradient glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-12 w-full h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-30 h-30  flex items-center justify-center p-1.5">
              <img
                src="/Logo1.png"
                alt="Vellum"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center pb-16">
            <h2 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Get your work
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                beautifully
                <br />
                organized.
              </span>
            </h2>
            <p className="text-white/60 text-base mt-6 max-w-md leading-relaxed">
              Kanban boards, calendar views, and analytics — all in one
              distraction-free workspace. No signup fees, no servers, no
              nonsense.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Boards", "Calendar", "Analytics", "Local-first"].map((f) => (
                <span
                  key={f}
                  className="text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Vellum — Built with care.
          </p>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <img
              src="/Logo2.png"
              alt="Vellum"
              className="w-11 h-11 object-contain"
            />
          </Link>

          {/* Headings */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {subtitle}
          </p>

          {/* Form (children) */}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
=======
import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f172a]">
      {/* LEFT — Branded visual panel (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1e2757]">
        {/* Gradient glows */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-12 w-full h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-30 h-30  flex items-center justify-center p-1.5">
              <img
                src="/Logo1.png"
                alt="Vellum"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center pb-16">
            <h2 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Get your work
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                beautifully
                <br />
                organized.
              </span>
            </h2>
            <p className="text-white/60 text-base mt-6 max-w-md leading-relaxed">
              Kanban boards, calendar views, and analytics — all in one
              distraction-free workspace. No signup fees, no servers, no
              nonsense.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Boards", "Calendar", "Analytics", "Local-first"].map((f) => (
                <span
                  key={f}
                  className="text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Vellum — Built with care.
          </p>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <img
              src="/Logo2.png"
              alt="Vellum"
              className="w-11 h-11 object-contain"
            />
          </Link>

          {/* Headings */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {subtitle}
          </p>

          {/* Form (children) */}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
>>>>>>> 49bb8c383e603f88f8c6496e1475c43d7052f977
