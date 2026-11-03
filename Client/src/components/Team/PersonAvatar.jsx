import React from "react";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000";

const COLORS = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
];
const COVERS = [
  "linear-gradient(120deg,#38bdf8,#6366f1)",
  "linear-gradient(120deg,#f472b6,#f97316)",
  "linear-gradient(120deg,#34d399,#0ea5e9)",
  "linear-gradient(120deg,#a78bfa,#ec4899)",
  "linear-gradient(120deg,#fbbf24,#f43f5e)",
];
const hash = (id = "") => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);

export const colorFor = (id) => COLORS[hash(id) % COLORS.length];
export const coverFor = (id) => COVERS[hash(id) % COVERS.length];
export const assetUrl = (path) => (path ? `${API_BASE}${path}` : null);

const PersonAvatar = ({ user, size = 40, ring = false }) => {
  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(10, size * 0.36),
  };
  const ringCls = ring ? "ring-4 ring-white dark:ring-slate-800" : "";

  if (user?.avatarUrl) {
    return (
      <img
        src={assetUrl(user.avatarUrl)}
        alt={user.name}
        style={style}
        className={`rounded-full object-cover shrink-0 ${ringCls}`}
      />
    );
  }
  return (
    <div
      style={style}
      className={`rounded-full ${colorFor(user?.id)} text-white font-bold flex items-center justify-center shrink-0 ${ringCls}`}
    >
      {initials}
    </div>
  );
};

export default PersonAvatar;
