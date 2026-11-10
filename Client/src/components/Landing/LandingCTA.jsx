import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";

const LandingCTA = () => (
  <section className="py-10 lg:py-16">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1e2757] via-[#2a3572] to-[#0f1738] px-6 py-16 lg:py-24 text-center text-white">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full bg-[var(--accent)] opacity-30 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Start your first board{" "}
              <span className="italic font-serif text-orange-300">today</span>
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-white/70">
              Create a board, invite your team and see how calm planning can
              feel.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-[#1e2757] text-sm font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 transition-transform shadow-xl"
              >
                Get started free <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors"
              >
                I already have an account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
              {[
                "Free to use",
                "Email or Google sign-in",
                "Export your data anytime",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <FiCheck className="text-orange-300" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default LandingCTA;
