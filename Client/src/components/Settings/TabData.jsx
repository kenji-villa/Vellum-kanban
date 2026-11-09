import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../utils/api";
import { isCardDone } from "../../utils/listStyle";
import { canEditBoard } from "../../utils/roles";
import ConfirmDialog from "../UI/ConfirmDialog";
import Modal from "../UI/Modal";

const MAX_BOARDS = 20;
const MAX_CARDS = 2000;

const today = () => new Date().toISOString().slice(0, 10);

const download = (filename, text, mime) => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Quote every cell; neutralise cells Excel would treat as formulas
const csvCell = (v) => {
  const s = String(v ?? "");
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Never trust a file: keep only what we know and cap sizes
const cleanBoard = (b) => ({
  title: str(b?.title, 80) || "Imported board",
  labels: (Array.isArray(b?.labels) ? b.labels : [])
    .map((l) => ({ name: str(l?.name, 24), color: str(l?.color, 12) }))
    .filter((l) => l.name)
    .slice(0, 30),
  lists: (Array.isArray(b?.lists) ? b.lists : []).slice(0, 30).map((l) => ({
    title: str(l?.title, 60) || "List",
    cards: (Array.isArray(l?.cards) ? l.cards : []).map((c) => ({
      title: str(c?.title, 120) || "Untitled task",
      description: str(c?.description, 2000),
      priority: ["low", "medium", "high"].includes(c?.priority)
        ? c.priority
        : "medium",
      dueDate: /^\d{4}-\d{2}-\d{2}$/.test(c?.dueDate || "") ? c.dueDate : "",
      labels: (Array.isArray(c?.labels) ? c.labels : [])
        .map((x) => str(x, 24))
        .filter(Boolean)
        .slice(0, 10),
    })),
  })),
});

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 dark:bg-slate-700/40 px-4 py-3">
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">
      {value}
    </p>
    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
      {label}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <section>
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const Row = ({ title, description, children }) => (
  <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 dark:border-slate-700 rounded-xl">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {description}
      </p>
    </div>
    <div className="flex gap-2 shrink-0">{children}</div>
  </div>
);

const Btn = ({ danger = false, children, ...props }) => (
  <button
    type="button"
    {...props}
    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 ${
      danger
        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
    }`}
  >
    {children}
  </button>
);

const TabData = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();
  const { state, refreshBoards } = useBoard();
  const { resetSettings } = useSettings();
  const fileRef = useRef(null);

  const [pending, setPending] = useState(null); // a parsed backup waiting for confirmation
  const [importing, setImporting] = useState(null); // { done, total }
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmPrefs, setConfirmPrefs] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);

  const stats = useMemo(() => {
    let lists = 0,
      tasks = 0,
      done = 0,
      comments = 0,
      deletable = 0;
    for (const b of state.boards) {
      for (const l of b.lists) {
        lists++;
        for (const c of l.cards) {
          tasks++;
          comments += c.comments || 0;
          if (isCardDone(c, l)) {
            done++;
            if (canEditBoard(b.role)) deletable++;
          }
        }
      }
    }
    return {
      boards: state.boards.length,
      lists,
      tasks,
      done,
      comments,
      deletable,
    };
  }, [state.boards]);

  /* ---------- Export ---------- */
  const exportJson = () => {
    const boards = state.boards
      .filter((b) => b.role === "owner")
      .map((b) => ({
        title: b.title,
        labels: (b.labels || []).map((l) => ({ name: l.name, color: l.color })),
        lists: b.lists.map((l) => ({
          title: l.title,
          cards: l.cards.map((c) => ({
            title: c.title,
            description: c.description || "",
            priority: c.priority,
            dueDate: c.dueDate || "",
            labels: c.labels || [],
            status: c.status || "OPEN",
            assignee: c.assignee || "",
          })),
        })),
      }));
    if (!boards.length)
      return toast.info("You don't own any boards to back up yet");
    download(
      `vellum-backup-${today()}.json`,
      JSON.stringify(
        {
          app: "vellum",
          version: 2,
          exportedAt: new Date().toISOString(),
          boards,
        },
        null,
        2,
      ),
      "application/json",
    );
    toast.success(
      `Backed up ${boards.length} board${boards.length === 1 ? "" : "s"}`,
    );
  };

  const exportCsv = () => {
    const header = [
      "Board",
      "List",
      "Title",
      "Description",
      "Priority",
      "Due date",
      "Status",
      "Assignee",
      "Labels",
      "Comments",
    ];
    const rows = [];
    for (const b of state.boards) {
      for (const l of b.lists) {
        for (const c of l.cards) {
          const status = isCardDone(c, l)
            ? "Done"
            : c.status === "SUBMITTED"
              ? "In review"
              : "Open";
          rows.push([
            b.title,
            l.title,
            c.title,
            c.description,
            c.priority,
            c.dueDate,
            status,
            c.assignee,
            (c.labels || []).join("; "),
            c.comments || 0,
          ]);
        }
      }
    }
    if (!rows.length) return toast.info("There are no tasks to export yet");
    const csv = [header, ...rows]
      .map((r) => r.map(csvCell).join(","))
      .join("\r\n");
    download(
      `vellum-tasks-${today()}.csv`,
      `\uFEFF${csv}`,
      "text/csv;charset=utf-8",
    );
    toast.success(`Exported ${rows.length} tasks`);
  };

  /* ---------- Import ---------- */
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024)
        throw new Error("That file is too large");
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed?.boards))
        throw new Error("That isn't a Vellum backup");
      const boards = parsed.boards.slice(0, MAX_BOARDS).map(cleanBoard);
      const counts = {
        boards: boards.length,
        lists: boards.reduce((n, b) => n + b.lists.length, 0),
        cards: boards.reduce(
          (n, b) => n + b.lists.reduce((m, l) => m + l.cards.length, 0),
          0,
        ),
      };
      if (!counts.boards) throw new Error("The backup has no boards");
      if (counts.cards > MAX_CARDS)
        throw new Error(`Too many tasks (the limit is ${MAX_CARDS})`);
      setPending({ fileName: file.name, boards, counts });
    } catch (err) {
      toast.error(
        err instanceof SyntaxError ? "That file isn't valid JSON" : err.message,
      );
    }
  };

  const runImport = async () => {
    const total = pending.counts.cards;
    let done = 0;
    setImporting({ done, total });
    try {
      for (const b of pending.boards) {
        const { board } = await api.createBoard({
          title: `${b.title} (imported)`,
        });
        if (b.lists.length) {
          for (const l of board.lists) await api.deleteList(l.id); // drop the 3 default lists
        }
        for (const l of b.labels) {
          try {
            await api.createLabel(board.id, l.name, l.color);
          } catch {
            /* duplicate or built-in label name */
          }
        }
        for (const l of b.lists) {
          const { list } = await api.createList(board.id, { title: l.title });
          for (const c of l.cards) {
            await api.createCard(list.id, c);
            done += 1;
            setImporting({ done, total });
          }
        }
      }
      toast.success("Import finished");
    } catch (err) {
      toast.error(err.message || "The import stopped early");
    } finally {
      setImporting(null);
      setPending(null);
      await refreshBoards();
    }
  };

  /* ---------- Housekeeping ---------- */
  const clearCompleted = async () => {
    setConfirmClear(false);
    setClearing(true);
    let n = 0;
    try {
      for (const b of state.boards) {
        if (!canEditBoard(b.role)) continue;
        for (const l of b.lists) {
          for (const c of l.cards) {
            if (isCardDone(c, l)) {
              await api.deleteCard(c.id);
              n++;
            }
          }
        }
      }
      toast.success(`${n} completed task${n === 1 ? "" : "s"} deleted`);
    } catch (err) {
      toast.error(err.message || "Couldn't delete everything");
    } finally {
      setClearing(false);
      await refreshBoards();
    }
  };

  const resetPrefs = () => {
    setConfirmPrefs(false);
    try {
      localStorage.removeItem("vellum_seen_alerts_v1");
    } catch {
      /* ignore */
    }
    resetSettings();
    toast.info("Preferences reset on this device");
  };

  /* ---------- Delete account ---------- */
  const canDelete =
    confirmEmail.trim().toLowerCase() === (user?.email || "").toLowerCase();

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount(confirmEmail.trim());
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Couldn't delete your account");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Data
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your boards live safely on the Vellum server, under your account. Back
          them up, move them around, or clean up here.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      <Section title="Your workspace">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Stat label="Boards" value={stats.boards} />
          <Stat label="Lists" value={stats.lists} />
          <Stat label="Tasks" value={stats.tasks} />
          <Stat label="Completed" value={stats.done} />
          <Stat label="Comments" value={stats.comments} />
        </div>
      </Section>

      <Section title="Back up & export">
        <Row
          title="Backup (JSON)"
          description="All boards you own, with their lists, tasks and labels. You can import it again later."
        >
          <Btn onClick={exportJson}>Download</Btn>
        </Row>
        <Row
          title="Task list (CSV)"
          description="Every task you can see, in a spreadsheet you can open in Excel or Google Sheets."
        >
          <Btn onClick={exportCsv}>Download</Btn>
        </Row>
      </Section>

      <Section title="Import">
        <Row
          title="Restore from a backup"
          description="Adds the boards in a Vellum backup as new boards. Your existing boards are never changed."
        >
          <Btn onClick={() => fileRef.current?.click()} disabled={!!importing}>
            Choose file
          </Btn>
        </Row>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFile}
        />

        {pending && !importing && (
          <div className="rounded-xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] p-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Ready to import “{pending.fileName}”
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {pending.counts.boards} board
              {pending.counts.boards === 1 ? "" : "s"}, {pending.counts.lists}{" "}
              list{pending.counts.lists === 1 ? "" : "s"} and{" "}
              {pending.counts.cards} task{pending.counts.cards === 1 ? "" : "s"}{" "}
              will be added as new boards. Assignees, comments and review status
              aren't restored.
            </p>
            <div className="flex gap-2 mt-3">
              <Btn onClick={() => setPending(null)}>Cancel</Btn>
              <button
                type="button"
                onClick={runImport}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                Import
              </button>
            </div>
          </div>
        )}

        {importing && (
          <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Importing… {importing.done}/{importing.total} tasks
            </p>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden mt-3">
              <div
                className="h-full bg-[var(--accent)] transition-all"
                style={{
                  width: `${importing.total ? (importing.done / importing.total) * 100 : 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Please keep this page open.
            </p>
          </div>
        )}
      </Section>

      <Section title="Housekeeping">
        <Row
          title="Delete completed tasks"
          description={`Permanently removes ${stats.deletable} completed task${stats.deletable === 1 ? "" : "s"} from boards you can edit.`}
        >
          <Btn
            danger
            disabled={!stats.deletable || clearing}
            onClick={() => setConfirmClear(true)}
          >
            {clearing ? "Deleting…" : "Delete"}
          </Btn>
        </Row>
        <Row
          title="Reset preferences"
          description="Sets theme, accent colour, defaults and dismissed alerts on this device back to normal. Your boards aren't touched."
        >
          <Btn onClick={() => setConfirmPrefs(true)}>Reset</Btn>
        </Row>
      </Section>

      <Section title="Danger zone">
        <div className="flex items-center justify-between gap-4 p-4 border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50/50 dark:bg-red-900/10">
          <div className="min-w-0">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Delete my account
            </p>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
              Permanently deletes your account and every board you own. People
              you shared those boards with lose access.
            </p>
          </div>
          <Btn danger onClick={() => setDeleteOpen(true)}>
            Delete account
          </Btn>
        </div>
      </Section>

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearCompleted}
        title="Delete completed tasks?"
        message={`This permanently deletes ${stats.deletable} completed task${stats.deletable === 1 ? "" : "s"}. Consider downloading a backup first.`}
        confirmText="Delete tasks"
      />
      <ConfirmDialog
        isOpen={confirmPrefs}
        onClose={() => setConfirmPrefs(false)}
        onConfirm={resetPrefs}
        title="Reset preferences?"
        message="Your theme, accent colour and defaults on this device go back to their original values."
        confirmText="Reset"
      />

      <Modal
        isOpen={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        title="Delete your account"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This can't be undone. All boards you own are deleted for everyone,
          your profile is removed, and your teammates lose the connection.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
          To confirm, type your email: <b>{user?.email}</b>
        </p>
        <input
          type="text"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          placeholder="Your email"
          className="w-full mt-3 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <div className="flex justify-end gap-3 mt-5">
          <Btn onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Btn>
          <button
            type="button"
            onClick={deleteAccount}
            disabled={!canDelete || deleting}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TabData;
