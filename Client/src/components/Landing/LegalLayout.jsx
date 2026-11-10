import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowRight, FiMail } from "react-icons/fi";
import LandingNav from "./LandingNav";
import LandingFooter from "./LandingFooter";
import Reveal from "./Reveal";
import { LEGAL } from "../../utils/legalContent";

const Item = ({ item }) => (
  <li className="flex gap-3 text-gray-600 dark:text-gray-300 leading-relaxed">
    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
    <span>
      {typeof item === "string" ? (
        item
      ) : (
        <>
          <b className="font-semibold text-gray-900 dark:text-gray-100">
            {item.lead}
          </b>{" "}
          {item.text}
        </>
      )}
    </span>
  </li>
);

const LegalLayout = ({ title, subtitle, summary, sections, other }) => {
  const toc = [
    ...sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "contact", title: "Contact us" },
  ];
  const [active, setActive] = useState(toc[0].id);

  const words = title.split(" ");
  const last = words.pop();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} | Vellum`;
  }, [title]);

  // Highlight the section you're reading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const jump = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* Banner */}
      <section className="relative overflow-hidden pt-32 pb-14 lg:pt-40 lg:pb-20 text-center">
        <div
          className="absolute inset-0 opacity-60 dark:opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(30,39,87,0.18) 1px, transparent 1.4px)",
            backgroundSize: "26px 26px",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000, transparent 85%)",
            maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          }}
        />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[var(--accent)]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-32 -left-32 w-[360px] h-[360px] bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm mb-6 animate-fade-up delay-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Legal
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.05] animate-blur-reveal delay-200">
            {words.join(" ")}{" "}
            <span className="italic font-serif bg-gradient-to-r from-[#1e2757] via-[var(--accent)] to-[#1e2757] bg-clip-text text-transparent dark:from-orange-300 dark:via-orange-400 dark:to-orange-300">
              {last}
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-600 dark:text-gray-400 animate-fade-up delay-300">
            {subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs animate-fade-up delay-400">
            <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
              Last updated {LEGAL.updated}
            </span>
            <Link
              to={other.to}
              className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)] hover:gap-2.5 transition-all"
            >
              Read the {other.label} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pb-24 grid lg:grid-cols-[16rem_1fr] gap-12">
        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              On this page
            </p>
            <ul className="border-l border-gray-200 dark:border-slate-700">
              {toc.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => jump(t.id)}
                    className={`block w-full text-left -ml-px pl-4 py-1.5 text-sm border-l-2 transition-colors ${
                      active === t.id
                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 max-w-3xl">
          <Reveal>
            <div className="rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] p-6 mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                In plain English
              </p>
              <ul className="space-y-2.5">
                {summary.map((s) => (
                  <li
                    key={s}
                    className="flex gap-3 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <FiCheck className="w-4 h-4 mt-0.5 text-[var(--accent)] shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {sections.map((s, i) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-28 mb-12">
                <h2 className="flex items-baseline gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  <span className="text-sm font-semibold text-[var(--accent)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                <div className="space-y-4">
                  {s.blocks.map((b, j) =>
                    b.type === "ul" ? (
                      <ul key={j} className="space-y-2.5">
                        {b.items.map((it, k) => (
                          <Item key={k} item={it} />
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={j}
                        className="text-gray-600 dark:text-gray-300 leading-relaxed"
                      >
                        {b.text}
                      </p>
                    ),
                  )}
                </div>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section id="contact" className="scroll-mt-28">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e2757] via-[#2a3572] to-[#0f1738] p-8 text-white">
                <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-[var(--accent)] opacity-30 blur-3xl pointer-events-none" />
                <div className="relative">
                  <h2 className="text-2xl font-bold">
                    Questions about this page?
                  </h2>
                  <p className="mt-2 text-sm text-white/70 max-w-md">
                    We're happy to help. Write to us and we'll get back to you
                    as soon as we can.
                  </p>
                  <a
                    href={`mailto:${LEGAL.contactEmail}`}
                    className="mt-5 inline-flex items-center gap-2 bg-white text-[#1e2757] text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 transition-transform"
                  >
                    <FiMail /> {LEGAL.contactEmail}
                  </a>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LegalLayout;
