export const ACTIVITY_ICON = {
  CREATED: "✨",
  ASSIGNED: "👤",
  UNASSIGNED: "👤",
  PRIORITY: "🚩",
  DUE: "📅",
  MOVED: "↔️",
  STATUS: "✅",
  COMMENT: "💬",
};

const statusText = (m = {}, subject) => {
  if (m.action === "submit")
    return m.status === "DONE" ? `marked ${subject} as done ✓` : `submitted ${subject} for review`;
  if (m.action === "approve") return `marked ${subject} as done ✓`;
  if (m.action === "request_changes") return `requested changes on ${subject}`;
  if (m.action === "reopen") return `reopened ${subject}`;
  return `updated the status of ${subject}`;
};

// `subject` is "this task" inside a task, or the task title in the board feed
export const describeActivity = (a, subject = "this task") => {
  const m = a.meta || {};
  switch (a.type) {
    case "CREATED":
      return `created ${subject}`;
    case "ASSIGNED":
      return `assigned ${subject} to ${m.toName || "someone"}`;
    case "UNASSIGNED":
      return `removed the assignee from ${subject}`;
    case "PRIORITY":
      return `changed the priority of ${subject} from ${m.from} to ${m.to}`;
    case "DUE":
      return m.to
        ? `${m.from ? "changed" : "set"} the due date of ${subject} to ${m.to}`
        : `removed the due date from ${subject}`;
    case "MOVED":
      return `moved ${subject} from ${m.from} to ${m.to}`;
    case "STATUS":
      return statusText(m, subject);
    case "COMMENT":
      return `commented on ${subject}`;
    default:
      return `updated ${subject}`;
  }
};