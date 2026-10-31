const COLORS = ["#38bdf8", "#a78bfa", "#f472b6", "#fbbf24", "#2dd4bf", "#fb7185"];

const MATCHERS = [
  { kind: "done", test: /\b(done|completed?|finished|shipped|released?)\b/i, color: "#22c55e" },
  { kind: "progress", test: /\b(in[\s-]?progress|doing|wip|review|testing)\b/i, color: "#f59e0b" },
  { kind: "todo", test: /\b(to[\s-]?do|backlog|planned|ideas?)\b/i, color: "#3b82f6" },
];

export const getListMeta = (title = "", index = 0) => {
  const hit = MATCHERS.find((m) => m.test.test(title));
  if (hit) return { kind: hit.kind, color: hit.color };
  return { kind: "custom", color: COLORS[index % COLORS.length] };
};