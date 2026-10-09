import React from "react";
import { Link } from "react-router-dom";

const LandingCTA = () => (
  <section className="py-20 lg:py-32">
    <div className="max-w-5xl mx-auto px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e2757] to-[#0f1738] p-12 lg:p-20 text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />

        <div className="relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Ready to get organized?
          </h2>
          <p className="mt-4 text-base lg:text-lg text-white/70 max-w-xl mx-auto">
            Start using Vellum in seconds. No signup, no setup, no servers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
            >
              Launch Vellum Free
            </Link>
            <a
              href="#features"
              className="text-white/80 hover:text-white font-medium px-6 py-3 text-sm transition-colors"
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LandingCTA;
