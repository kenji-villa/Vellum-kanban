import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useNotifications } from "../../context/NotificationContext";
import PersonAvatar from "../Team/PersonAvatar";

const TeamDirectory = () => {
  const { teamVersion } = useNotifications();
  const [members, setMembers] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getTeam()
      .then((t) => !cancelled && setMembers(t.members))
      .catch(() => !cancelled && setMembers([]));
    return () => {
      cancelled = true;
    };
  }, [teamVersion]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          Team
        </h3>
        <Link
          to="/team"
          className="text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {members?.length ? "View all" : "Invite"}
        </Link>
      </div>

      {members === null ? (
        <div className="h-16 rounded-xl bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
      ) : members.length === 0 ? (
        <p className="text-xs text-gray-400 py-3">
          No teammates yet.{" "}
          <Link
            to="/team"
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Invite people
          </Link>
        </p>
      ) : (
        <div className="flex items-start gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {members.map(({ user }) => (
            <div
              key={user.id}
              className="flex flex-col items-center text-center shrink-0 w-[68px]"
            >
              <PersonAvatar user={user} size={48} />
              <p className="text-[10px] font-medium text-gray-700 dark:text-gray-200 leading-tight mt-2 truncate w-full">
                {user.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamDirectory;
