import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";
import PersonAvatar, { coverFor, assetUrl } from "./PersonAvatar";

const ProfileCard = ({ userId, onChanged }) => {
  const toast = useToast();
  const { bumpTeam, refresh } = useNotifications();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { user } = await api.getUserProfile(userId);
      setUser(user);
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't load this profile");
    }
  };

  useEffect(() => {
    setUser(null);
    load();
  }, [userId]);

  const done = async (message) => {
    toast.success(message);
    await load();
    refresh();
    bumpTeam();
    onChanged?.();
  };

  const sendInvite = async () => {
    setBusy(true);
    try {
      const res = await api.sendInvitation(user.id, note.trim());
      await done(
        res.status === "accepted"
          ? `You and ${user.name} are now teammates`
          : `Invitation sent to ${user.name}`,
      );
    } catch (err) {
      toast.error(err.message || "Couldn't send invitation");
    } finally {
      setBusy(false);
    }
  };

  const accept = async () => {
    setBusy(true);
    try {
      await api.acceptInvitation(user.invitationId);
      await done(`You and ${user.name} are now teammates`);
    } catch (err) {
      toast.error(err.message || "Couldn't accept");
    } finally {
      setBusy(false);
    }
  };

  if (error)
    return <p className="text-sm text-red-500 py-6 text-center">{error}</p>;
  if (!user) {
    return (
      <div className="h-64 rounded-2xl bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
    );
  }

  const banner = assetUrl(user.bannerUrl);
  const since = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="-mx-1">
      <div
        className="h-28 rounded-2xl bg-cover bg-center"
        style={
          banner
            ? { backgroundImage: `url(${banner})` }
            : { background: coverFor(user.id) }
        }
      />
      <div className="px-2">
        <div className="-mt-10">
          <PersonAvatar user={user} size={80} ring />
        </div>
        <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
          {user.name}
        </h3>
        <p className="text-sm text-[var(--accent)] font-medium">
          {user.title || "Vellum member"}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Member since {since}</p>

        {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4 whitespace-pre-line">
            {user.bio}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
          {user.relation === "self" && (
            <p className="text-xs text-gray-400">
              This is your public profile.
            </p>
          )}
          {user.relation === "teammate" && (
            <p className="text-sm font-medium text-green-600">✓ In your team</p>
          )}
          {user.relation === "invited" && (
            <p className="text-sm font-medium text-gray-500">
              Invitation pending
            </p>
          )}
          {user.relation === "invited_you" && (
            <button
              onClick={accept}
              disabled={busy}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60"
            >
              {busy ? "Accepting…" : "Accept their invitation"}
            </button>
          )}
          {user.relation === "none" && (
            <div className="space-y-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 200))}
                placeholder="Add a note (optional)"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              />
              <button
                onClick={sendInvite}
                disabled={busy}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send invitation"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
