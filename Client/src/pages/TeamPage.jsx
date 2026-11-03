import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/UI/Modal";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import PersonAvatar, { coverFor } from "../components/Team/PersonAvatar";
import FindPeopleModal from "../components/Team/FindPeopleModal";
import ProfileCard from "../components/Team/ProfileCard";
import { api } from "../utils/api";
import { useToast } from "../context/ToastContext";
import { useNotifications } from "../context/NotificationContext";

const monthYear = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 min-w-[104px]">
    <p className="text-2xl font-bold leading-none">{value}</p>
    <p className="text-[11px] text-white/70 mt-1.5">{label}</p>
  </div>
);

const SectionTitle = ({ children, count }) => (
  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
    {children}
    {count > 0 && (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        {count}
      </span>
    )}
  </h2>
);

const TeamPage = () => {
  const toast = useToast();
  const { teamVersion, refresh } = useNotifications();
  const [team, setTeam] = useState({ members: [], sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [findOpen, setFindOpen] = useState(false);
  const [peekId, setPeekId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setTeam(await api.getTeam());
    } catch (err) {
      toast.error(err.message || "Couldn't load your team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, teamVersion]);

  const run = async (id, fn, successMsg) => {
    setBusyId(id);
    try {
      await fn();
      toast.success(successMsg);
      await load();
      refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  const { members, sent, received } = team;
  const btn =
    "px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60";

  return (
    <div className="flex min-h-screen app-bg">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl p-7 mb-8 text-white shadow-lg animate-rise"
          style={{
            background:
              "linear-gradient(120deg, #1e2757 0%, #2a3572 55%, var(--accent) 150%)",
          }}
        >
          <div className="pointer-events-none absolute -right-10 -top-16 w-64 h-64 rounded-full bg-[var(--accent)] opacity-30 blur-3xl animate-float" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">
                Your people
              </p>
              <h1 className="text-3xl font-bold mt-1">Team</h1>
              <p className="text-sm text-white/75 mt-1">
                Invite people you work with and keep everyone in one place.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Stat label="Teammates" value={members.length} />
                <Stat label="Invites sent" value={sent.length} />
                <Stat label="Waiting for you" value={received.length} />
              </div>
            </div>
            <button
              onClick={() => setFindOpen(true)}
              className="flex items-center gap-2 bg-white text-[#1e2757] font-semibold text-sm px-5 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              Invite people
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-white/70 dark:bg-slate-800/70"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Invitations waiting for you */}
            {received.length > 0 && (
              <section className="animate-rise">
                <SectionTitle count={received.length}>
                  Invitations for you
                </SectionTitle>
                <ul className="space-y-2">
                  {received.map((r) => (
                    <li
                      key={r.invitationId}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-ring)]"
                    >
                      <PersonAvatar user={r.user} size={44} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          <span className="font-semibold">{r.user.name}</span>{" "}
                          wants you on their team
                        </p>
                        {r.message && (
                          <p className="text-xs text-gray-500 italic truncate">
                            “{r.message}”
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setPeekId(r.user.id)}
                        className={`${btn} text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-700`}
                      >
                        Profile
                      </button>
                      <button
                        disabled={busyId === r.invitationId}
                        onClick={() =>
                          run(
                            r.invitationId,
                            () => api.acceptInvitation(r.invitationId),
                            `You and ${r.user.name} are now teammates`,
                          )
                        }
                        className={`${btn} bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white`}
                      >
                        Accept
                      </button>
                      <button
                        disabled={busyId === r.invitationId}
                        onClick={() =>
                          run(
                            r.invitationId,
                            () => api.declineInvitation(r.invitationId),
                            "Invitation declined",
                          )
                        }
                        className={`${btn} bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100`}
                      >
                        Decline
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Members */}
            <section>
              <SectionTitle count={members.length}>Teammates</SectionTitle>

              {members.length === 0 ? (
                <div className="flex flex-col items-center text-center py-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-dashed border-gray-200 dark:border-slate-700 animate-rise">
                  <div className="flex -space-x-3 mb-5" aria-hidden="true">
                    {["#38bdf8", "#f472b6", "#fbbf24"].map((c, i) => (
                      <div
                        key={c}
                        className="w-12 h-12 rounded-full ring-4 ring-white dark:ring-slate-800 flex items-center justify-center text-white text-lg"
                        style={{ background: c, opacity: 1 - i * 0.18 }}
                      >
                        {i === 0 ? "🙂" : i === 1 ? "😎" : "＋"}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Build your team
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5 max-w-sm">
                    Search for people by name or email and send them an
                    invitation. They'll get a notification and can accept in one
                    click.
                  </p>
                  <button
                    onClick={() => setFindOpen(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent-ring)]"
                  >
                    Invite your first teammate
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {members.map((m, i) => (
                    <div
                      key={m.invitationId}
                      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden card-lift animate-rise"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div
                        className="h-16"
                        style={{ background: coverFor(m.user.id) }}
                      />
                      <div className="px-5 pb-5 -mt-8">
                        <PersonAvatar user={m.user} size={64} ring />
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {m.user.name}
                        </h3>
                        <p className="text-xs text-[var(--accent)] font-medium truncate">
                          {m.user.title || "Teammate"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Teammates since {monthYear(m.since)}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => setPeekId(m.user.id)}
                            className={`${btn} flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200`}
                          >
                            View profile
                          </button>
                          <button
                            onClick={() => setRemoveTarget(m)}
                            className={`${btn} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Sent invitations */}
            {sent.length > 0 && (
              <section className="animate-rise">
                <SectionTitle count={sent.length}>
                  Sent invitations
                </SectionTitle>
                <ul className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700">
                  {sent.map((s) => (
                    <li
                      key={s.invitationId}
                      className="flex items-center gap-3 p-4"
                    >
                      <PersonAvatar user={s.user} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {s.user.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Sent {monthYear(s.createdAt)}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Pending
                      </span>
                      <button
                        disabled={busyId === s.invitationId}
                        onClick={() =>
                          run(
                            s.invitationId,
                            () => api.cancelInvitation(s.invitationId),
                            "Invitation cancelled",
                          )
                        }
                        className={`${btn} text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700`}
                      >
                        Cancel
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>

      <FindPeopleModal
        isOpen={findOpen}
        onClose={() => setFindOpen(false)}
        onChanged={load}
      />

      <Modal isOpen={!!peekId} onClose={() => setPeekId(null)} title="Profile">
        {peekId && <ProfileCard userId={peekId} onChanged={load} />}
      </Modal>

      <ConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() =>
          run(
            removeTarget.user.id,
            () => api.removeTeammate(removeTarget.user.id),
            `${removeTarget.user.name} removed from your team`,
          )
        }
        title="Remove teammate?"
        message={`Remove ${removeTarget?.user.name} from your team? You can invite them again later.`}
        confirmText="Remove"
      />
    </div>
  );
};

export default TeamPage;
