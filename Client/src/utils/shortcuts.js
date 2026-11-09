export const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
export const MOD = isMac ? "⌘" : "Ctrl";

// Adjust the paths here if your routes differ
export const GO_TO = {
  d: { path: "/dashboard", label: "Dashboard" },
  p: { path: "/projects", label: "Projects" },
  c: { path: "/calendar", label: "Calendar" },
  a: { path: "/analytics", label: "Analytics" },
  t: { path: "/team", label: "Team" },
  s: { path: "/settings", label: "Settings" },
};

// Single source of truth: used by the cheat sheet and the Settings tab
export const SHORTCUT_GROUPS = [
  {
    title: "General",
    items: [
      { keys: [MOD, "K"], label: "Open the command palette" },
      { keys: ["?"], label: "Show keyboard shortcuts" },
      { keys: ["Shift", "D"], label: "Toggle dark mode" },
      { keys: ["Esc"], label: "Close a dialog or menu" },
    ],
  },
  {
    title: "Go to",
    items: Object.entries(GO_TO).map(([key, v]) => ({
      keys: ["G", key.toUpperCase()],
      then: true,
      label: v.label,
    })),
  },
  {
    title: "Create & find",
    items: [
      { keys: ["N"], label: "New task" },
      { keys: ["B"], label: "New board" },
      { keys: ["/"], label: "Focus the search box" },
    ],
  },
  {
    title: "Writing",
    items: [
      { keys: [MOD, "Enter"], label: "Post a comment" },
      { keys: ["Enter"], label: "Confirm a name or quick-add field" },
    ],
  },
];