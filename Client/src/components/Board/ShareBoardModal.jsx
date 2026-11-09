import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/Modal";
import PersonAvatar from "../Team/PersonAvatar";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";

const ROLE_LABEL = { editor: "Editor", viewer: "Viewer" };

const RoleSelect = ({ value, onChange, disabled }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="text-xs font-medium rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-gray-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] disabled:opacity-60"
  >
    <option value="editor">Editor · can edit</option>
    <option value="viewer">Viewer · view only</option>
  </select>
);

const ShareBoardModal = ({ isOpen, onClose, board }) => {
  const { user } = useAuth();
  const { refreshBoards } = useBoard();
  const toast = useToast();
  const navigate = useNavigate();
  const isOwner = board.role === "owner";

  const [data, setData] = useState({ owner: null, members: [] });
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [newRole, setNewRole] = useState("editor");

  const load = async () => {
    try {
      const [m, t] = await Promise.all([
        api.getBoardMembers(board.id),
        api.getTeam(),
      ]);
      setData(m);
      setTeam(t.members.map((x) => x.user));
    } catch (err) {
      toast.error(err.message || "Couldn't load sharing info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      load();
    }
  }, [isOpen, board.id]);

  const memberIds = new Set(data.members.map((m) => m.id));
  const available = team.filter((p) => !memberIds.has(p.id));

  const add = async (p) => {
    setBusyId(p.id);
    try {
      await api.addBoardMember(board.id, p.id, newRole);
      toast.success(
        newRole === "viewer"
          ? `${p.name} can now view this board`
          : `${p.name} can now work on this board`,
      );
      await load();
      refreshBoards();
    } catch (err) {
      toast.error(err.message || "Couldn't add person");
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = async (m, role) => {
    setBusyId(m.id);
    try {
      await api.updateBoardMemberRole(board.id, m.id, role);
      toast.success(`${m.name} is now ${ROLE_LABEL[role].toLowerCase()}`);
      await load();
      refreshBoards();
    } catch (err) {
      toast.error(err.message || "Couldn't change role");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p) => {
    const self = p.id === user.id;
    setBusyId(p.id);
    try {
      await api.removeBoardMember(board.id, p.id);
      if (self) {
        toast.info(`You left "${board.title}"`);
        onClose();
        await refreshBoards();
        navigate("/dashboard");
      } else {
        toast.success(`${p.name} removed from this board`);
        await load();
        refreshBoards();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  const pill =
    "px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share “${board.title}”`}>
      {loading ? (
        <div className="h-40 rounded-xl bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
      ) : (
        <div className="space-y-5">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              People with access
            </h3>
            <ul className="space-y-1">
              {data.owner && (
                <li className="flex items-center gap-3 p-2 rounded-xl">
                  <PersonAvatar user={data.owner} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {data.owner.name}
                      {data.owner.id === user.id && " (you)"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {data.owner.title || "Owner"}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    Owner
                  </span>
                </li>
              )}
              {data.members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 p-2 rounded-xl"
                >
                  <PersonAvatar user={m} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {m.name}
                      {m.id === user.id && " (you)"}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {m.title || "Member"}
                    </p>
                  </div>

                  {isOwner ? (
                    <RoleSelect
                      value={m.role}
                      disabled={busyId === m.id}
                      onChange={(role) => changeRole(m, role)}
                    />
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300">
                      {ROLE_LABEL[m.role] || "Editor"}
                    </span>
                  )}

                  {(isOwner || m.id === user.id) && (
                    <button
                      onClick={() => remove(m)}
                      disabled={busyId === m.id}
                      className={`${pill} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
                    >
                      {m.id === user.id ? "Leave" : "Remove"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {isOwner && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Add a teammate
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">Add as</span>
                  <RoleSelect value={newRole} onChange={setNewRole} />
                </div>
              </div>

              {team.length === 0 ? (
                <p className="text-sm text-gray-400">
                  You have no teammates yet.{" "}
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/team");
                    }}
                    className="text-[var(--accent)] font-medium hover:underline"
                  >
                    Invite people first
                  </button>
                </p>
              ) : available.length === 0 ? (
                <p className="text-sm text-gray-400">
                  All your teammates already have access.
                </p>
              ) : (
                <ul className="space-y-1 max-h-56 overflow-y-auto">
                  {available.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <PersonAvatar user={p} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {p.title || "Teammate"}
                        </p>
                      </div>
                      <button
                        onClick={() => add(p)}
                        disabled={busyId === p.id}
                        className={`${pill} bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white`}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ShareBoardModal;
