import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  // Build 6 rows × 7 days
  const rows = [];
  let day = gridStart;
  while (day <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
  }

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="w-7 h-7 rounded-full bg-[#1e2757] text-white flex items-center justify-center hover:bg-[#151c45] text-xs"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-7 h-7 rounded-full bg-[#1e2757] text-white flex items-center justify-center hover:bg-[#151c45] text-xs"
          >
            →
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 text-center mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold text-gray-500 tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="space-y-1">
        {rows.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 text-center">
            {week.map((d, di) => {
              const isToday = isSameDay(d, today);
              const inMonth = isSameMonth(d, monthStart);
              return (
                <div
                  key={di}
                  className={`text-xs py-1.5 rounded-full mx-auto w-7 h-7 flex items-center justify-center transition-colors ${
                    isToday
                      ? "bg-orange-500 text-white font-bold"
                      : inMonth
                        ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                        : "text-gray-300"
                  }`}
                >
                  {format(d, "d")}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
