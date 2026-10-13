import React from "react";

const COLORS = [
  "#f97316", // orange (brand)
  "#1e2757", // navy (brand)
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f43f5e", // rose
  "#facc15", // yellow
  "#64748b", // slate
];

const DonutChart = ({ data, size = 180, thickness = 26 }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-gray-400"
        style={{ width: size, height: size }}
      >
        No data yet
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        className="text-gray-100 dark:text-slate-700"
      />
      {data.map((slice, i) => {
        const fraction = slice.count / total;
        const length = fraction * circumference;
        const dashArray = `${length} ${circumference - length}`;
        const dashOffset = -accumulated;
        accumulated += length;
        return (
          <circle
            key={slice.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={thickness}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
};

export default DonutChart;
