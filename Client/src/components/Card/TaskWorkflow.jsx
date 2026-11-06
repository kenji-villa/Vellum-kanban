import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FiSend, FiCheckCircle, FiRotateCcw } from "react-icons/fi";

const STATUS = {
  OPEN: {
    label: "Open",
    box: "border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60",
    pill: "bg-gray-200 text-gray-600",
  },
  SUBMITTED: {
    label: "In review",
    box: "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10",
    pill: "bg-amber-200 text-amber-800",
  },
  DONE: {
    label: "Done",
    box: "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10",
    pill: "bg-green-200 text-green-800",
  },
};

const btn =
  "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60";

const TaskWorkflow = ({ card, me, boardRole, people = [], onAction }) => {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const status = card.status || "OPEN";
  const s = STATUS[status] || STATUS.OPEN;
  const isAssignee = !!card.assigneeId && card.assigneeId === me;
  const canReview =
    boardRole !== "member" || card.assignedById === me || !card.assigneeId;
  const assigner = people.find((p) => p.id === card.assignedById);
  const needsReview =
    !!card.assignedById && card.assignedById !== card.assigneeId;

  const run = async (action) => {
    setBusy(true);
    try {
      await onAction(action, note.trim());
      setNote("");
    } finally {
      setBusy(false);
    }
  };

  const noteBox = (placeholder) => (
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value.slice(0, 200))}
      rows={2}
      placeholder={placeholder}
      className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
    />
  );

  return (
    <div className={`mb-5 rounded-xl border p-4 ${s.box}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Task status
        </span>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.pill}`}
        >
          {s.label}
        </span>
      </div>

      {status === "OPEN" &&
        (isAssignee ? (
          <>
            {needsReview &&
              noteBox(
                `Note for ${assigner?.name || "your reviewer"} (optional)`,
              )}
            <button
              type="button"
              disabled={busy}
              onClick={() => run("submit")}
              className={`${btn} bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white`}
            >
              <FiSend />
              {needsReview ? "Submit for review" : "Mark as done"}
            </button>
            {needsReview && (
              <p className="text-[11px] text-gray-400 mt-2">
                {assigner?.name || "The person who assigned this"} will be
                notified.
              </p>
            )}
          </>
        ) : canReview ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run("approve")}
            className={`${btn} bg-green-600 hover:bg-green-700 text-white`}
          >
            <FiCheckCircle />
            Mark as done
          </button>
        ) : (
          <p className="text-xs text-gray-500">
            Only {card.assignee || "the assignee"} can submit this task.
          </p>
        ))}

      {status === "SUBMITTED" &&
        (canReview ? (
          <>
            {noteBox("Feedback for the assignee (optional)")}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => run("approve")}
                className={`${btn} bg-green-600 hover:bg-green-700 text-white`}
              >
                <FiCheckCircle />
                Approve
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => run("request_changes")}
                className={`${btn} border border-amber-400 text-amber-700 hover:bg-amber-100`}
              >
                <FiRotateCcw />
                Request changes
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-600">
            {isAssignee
              ? `Waiting for ${assigner?.name || "your reviewer"} to review your work.`
              : "Submitted and waiting for review."}
          </p>
        ))}

      {status === "DONE" && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-green-700 dark:text-green-400">
            ✓ Completed
            {card.completedAt
              ? ` ${formatDistanceToNow(new Date(card.completedAt), { addSuffix: true })}`
              : ""}
          </p>
          {(canReview || isAssignee) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run("reopen")}
              className={`${btn} border border-gray-300 text-gray-600 hover:bg-white`}
            >
              <FiRotateCcw />
              Reopen
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskWorkflow;
