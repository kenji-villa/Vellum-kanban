// Tailwind needs full class names, so every colour is spelled out here
export const LABEL_COLORS = {
  pink: { pill: "bg-pink-100 text-pink-700", dot: "bg-pink-500", ring: "ring-pink-300" },
  purple: { pill: "bg-purple-100 text-purple-700", dot: "bg-purple-500", ring: "ring-purple-300" },
  blue: { pill: "bg-blue-100 text-blue-700", dot: "bg-blue-500", ring: "ring-blue-300" },
  red: { pill: "bg-red-100 text-red-700", dot: "bg-red-500", ring: "ring-red-300" },
  green: { pill: "bg-green-100 text-green-700", dot: "bg-green-500", ring: "ring-green-300" },
  orange: { pill: "bg-orange-100 text-orange-700", dot: "bg-orange-500", ring: "ring-orange-300" },
  yellow: { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500", ring: "ring-yellow-300" },
  teal: { pill: "bg-teal-100 text-teal-700", dot: "bg-teal-500", ring: "ring-teal-300" },
  indigo: { pill: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500", ring: "ring-indigo-300" },
  gray: { pill: "bg-gray-200 text-gray-700", dot: "bg-gray-500", ring: "ring-gray-300" },
};

export const COLOR_KEYS = Object.keys(LABEL_COLORS);

export const DEFAULT_LABELS = [
  { name: "Design", color: "pink" },
  { name: "UI", color: "purple" },
  { name: "Development", color: "blue" },
  { name: "Bug", color: "red" },
  { name: "System", color: "gray" },
  { name: "Research", color: "orange" },
  { name: "Marketing", color: "yellow" },
];

const LEGACY = { shipped: "green" };

// Colour classes for a label name: board label, then built-in, then grey
export const labelColor = (name, boardLabels = []) => {
  const lower = String(name).toLowerCase();
  const custom = boardLabels.find((l) => l.name.toLowerCase() === lower);
  const builtIn = DEFAULT_LABELS.find((l) => l.name.toLowerCase() === lower);
  const key = custom?.color || builtIn?.color || LEGACY[lower] || "gray";
  return LABEL_COLORS[key] || LABEL_COLORS.gray;
};