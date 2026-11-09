import React, { useCallback, useEffect, useState } from "react";
import pkg from "../../../package.json";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { isSocketConnected } from "../../utils/socket";

const API_ROOT = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/api\/?$/, "");

const STACK = [
  { name: "React", role: "Interface" },
  { name: "Vite", role: "Build tool" },
  { name: "Tailwind CSS v4", role: "Styling" },
  { name: "Express", role: "API server" },
  { name: "PostgreSQL + Prisma", role: "Database" },
  { name: "Socket.IO", role: "Live sync" },
  { name: "dnd-kit", role: "Drag & drop" },
  { name: "date-fns", role: "Dates" },
];

const RELEASES = [
  {
    title: "Work together",
    items: [
      "Invite teammates by name or email",
      "Share boards as editor or view-only",
      "Assign tasks, then submit them for review",
      "Comments and an activity feed on every task",
    ],
  },
  {
    title: "Stay in the loop",
    items: [
      "Notification bell for invitations, assignments and deadlines",
      "Live sync: teammates' changes appear instantly",
    ],
  },
  {
    title: "Make it yours",
    items: [
      "Custom labels per board",
      "Richer profiles with skills, languages and links",
      "Command palette and keyboard shortcuts",
    ],
  },
];

const Dot = ({ tone }) => (
  <span
    className={`w-2.5 h-2.5 rounded-full ${
      tone === "ok"
        ? "bg-green-500"
        : tone === "bad"
          ? "bg-red-500"
          : "bg-amber-400 animate-pulse"
    }`}
  />
);

const StatusRow = ({ label, tone, value }) => (
  <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-slate-700/40 rounded-lg">
    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
    <span className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
      <Dot tone={tone} />
      {value}
    </span>
  </div>
);

const TabAbout = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [apiStatus, setApiStatus] = useState({ state: "checking" });
  const [live, setLive] = useState(isSocketConnected());

  const checkApi = useCallback(async () => {
    setApiStatus({ state: "checking" });
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_ROOT}/`);
      if (!res.ok) throw new Error("bad status");
      setApiStatus({ state: "ok", ms: Math.round(performance.now() - t0) });
    } catch {
      setApiStatus({ state: "down" });
    }
  }, []);

  useEffect(() => {
    checkApi();
    const id = setInterval(() => setLive(isSocketConnected()), 2000);
    return () => clearInterval(id);
  }, [checkApi]);

  const copyDiagnostics = async () => {
    const lines = [
      `Vellum ${pkg.version}`,
      `Signed in as: ${user?.email || "-"}`,
      `API: ${apiStatus.state}${apiStatus.ms ? ` (${apiStatus.ms} ms)` : ""}`,
      `Live sync: ${live ? "connected" : "offline"}`,
      `Browser: ${navigator.userAgent}`,
      `Time: ${new Date().toISOString()}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Diagnostics copied. Paste them into your bug report.");
    } catch {
      toast.error("Couldn't copy to the clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          About Vellum
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Version {pkg.version} · A calm Kanban for teams that get things done.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      <div className="relative overflow-hidden bg-gradient-to-br from-[#1e2757] to-[#0f1738] rounded-2xl p-6 text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 w-56 h-56 rounded-full bg-[var(--accent)] opacity-30 blur-3xl" />
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center font-bold text-xl mb-4">
            V
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            Vellum helps you plan work on boards, share them with your
            teammates, assign and review tasks, and talk about them in one
            place, with changes appearing live for everyone.
          </p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            System status
          </h3>
          <button
            type="button"
            onClick={checkApi}
            className="text-xs font-medium text-[var(--accent)] hover:underline"
          >
            Check again
          </button>
        </div>
        <div className="space-y-2">
          <StatusRow
            label="Vellum server"
            tone={
              apiStatus.state === "ok"
                ? "ok"
                : apiStatus.state === "down"
                  ? "bad"
                  : "wait"
            }
            value={
              apiStatus.state === "ok"
                ? `Online · ${apiStatus.ms} ms`
                : apiStatus.state === "down"
                  ? "Can't reach the server"
                  : "Checking…"
            }
          />
          <StatusRow
            label="Live sync"
            tone={live ? "ok" : "bad"}
            value={live ? "Connected" : "Offline (refreshing every minute)"}
          />
        </div>
        <button
          type="button"
          onClick={copyDiagnostics}
          className="mt-3 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
        >
          Copy diagnostics for a bug report
        </button>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          What's in this version
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RELEASES.map((r) => (
            <div
              key={r.title}
              className="p-4 bg-gray-50 dark:bg-slate-700/40 rounded-xl"
            >
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {r.title}
              </p>
              <ul className="space-y-1.5">
                {r.items.map((i) => (
                  <li
                    key={i}
                    className="text-xs text-gray-600 dark:text-gray-300 flex gap-2"
                  >
                    <span className="text-[var(--accent)]">•</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Your privacy
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Your boards, tasks and comments are stored on the Vellum server under
          your account. Only you and the people you share a board with can see
          it. Passwords are stored as one-way hashes, never in plain text. You
          can download everything or delete your account any time from the Data
          tab.
        </p>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Built with
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {STACK.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/40 rounded-lg"
            >
              <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                {s.name}
              </span>
              <span className="text-[10px] text-gray-400">{s.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabAbout;
