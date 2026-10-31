import React from "react";

const ListIcon = ({ kind, color }) => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" aria-hidden="true">
    {kind === "todo" && (
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="2" />
    )}
    {kind === "progress" && (
      <>
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <path d="M8 3.5a4.5 4.5 0 010 9z" fill={color} />
      </>
    )}
    {kind === "done" && (
      <>
        <circle cx="8" cy="8" r="7" fill={color} />
        <path
          d="M5 8.2l2 2 4-4.4"
          stroke="#fff"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
    {kind === "custom" && (
      <>
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="3.5"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <circle cx="8" cy="8" r="2" fill={color} />
      </>
    )}
  </svg>
);

export default ListIcon;
