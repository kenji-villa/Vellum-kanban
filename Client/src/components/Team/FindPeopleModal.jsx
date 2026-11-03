import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import { api } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";
import PersonAvatar from "./PersonAvatar";
import ProfileCard from "./ProfileCard";

const FindPeopleModal = ({ isOpen, onClose, onChanged }) => {
  const toast = useToast();
  const { bumpTeam, refresh } = useNotifications();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setProfileId(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const { users } = await api.searchUsers(q);
        if (!cancelled) setResults(users);
      } catch (err) {
        if (!cancelled) toast.error(err.message || "Search failed");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, nonce]);

  const patch = (id, relation, invitationId = null) =>
    setResults((rs) =>
      rs.map((u) => (u.id === id ? { ...u, relation, invitationId } : u)),
    );

  const quickInvite = async (u) => {
    setBusyId(u.id);
    try {
      const res = await api.sendInvitation(u.id);
      if (res.status === "accepted") {
        patch(u.id, "teammate");
        toast.success(`You and ${u.name} are now teammates`);
      } else {
        patch(u.id, "invited", res.invitationId);
        toast.success(`Invitation sent to ${u.name}`);
      }
      refresh();
      bumpTeam();
      onChanged?.();
    } catch (err) {
      toast.error(err.message || "Couldn't send invitation");
    } finally {
      setBusyId(null);
    }
  };

  const quickAccept = async (u) => {
    setBusyId(u.id);
    try {
      await api.acceptInvitation(u.invitationId);
      patch(u.id, "teammate");
      toast.success(`You and ${u.name} are now teammates`);
      refresh();
      bumpTeam();
      onChanged?.();
    } catch (err) {
      toast.error(err.message || "Couldn't accept");
    } finally {
      setBusyId(null);
    }
  };

  const pill = "px-3 py-1.5 rounded-lg text-xs font-semibold";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={profileId ? "Profile" : "Invite people"}
    >
      {profileId ? (
        <>
          <button
            onClick={() => {
              setProfileId(null);
              setNonce((n) => n + 1);
            }}
            className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-3"
          >
            ← Back to results
          </button>
          <ProfileCard userId={profileId} onChanged={onChanged} />
        </>
      ) : (
        <>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, or type an exact email"
              autoFocus
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
            />
          </div>

          {query.trim().length < 2 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              Type at least 2 letters. If several people share a name, open
              their profile to tell them apart.
            </p>
          ) : searching && results.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Searching…</p>
          ) : results.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              No one found for “{query.trim()}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto -mx-1">
              {results.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 p-2.5 mx-1 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <PersonAvatar user={u} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {[u.title, u.emailHint].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <button
                    onClick={() => setProfileId(u.id)}
                    className={`${pill} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700`}
                  >
                    Profile
                  </button>
                  {u.relation === "none" && (
                    <button
                      onClick={() => quickInvite(u)}
                      disabled={busyId === u.id}
                      className={`${pill} bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60`}
                    >
                      Invite
                    </button>
                  )}
                  {u.relation === "invited" && (
                    <span
                      className={`${pill} bg-gray-100 dark:bg-slate-700 text-gray-400`}
                    >
                      Pending
                    </span>
                  )}
                  {u.relation === "invited_you" && (
                    <button
                      onClick={() => quickAccept(u)}
                      disabled={busyId === u.id}
                      className={`${pill} bg-green-500 hover:bg-green-600 text-white disabled:opacity-60`}
                    >
                      Accept
                    </button>
                  )}
                  {u.relation === "teammate" && (
                    <span
                      className={`${pill} bg-green-50 dark:bg-green-900/20 text-green-600`}
                    >
                      ✓ Teammate
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Modal>
  );
};

export default FindPeopleModal;
