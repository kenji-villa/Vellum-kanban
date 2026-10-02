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

  const weeks = [];
  let day = gridStart;
  while (day <= gridEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="w-6 h-6 rounded-full text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-6 h-6 rounded-full text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-[10px] font-semibold text-gray-400 tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d, di) => {
              const isToday = isSameDay(d, today);
              const inMonth = isSameMonth(d, monthStart);
              return (
                <div
                  key={di}
                  className={`text-[11px] mx-auto w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
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
