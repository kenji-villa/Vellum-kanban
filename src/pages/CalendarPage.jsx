import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import Sidebar from "../components/Sidebar";
import { useBoard } from "../context/BoardContext";
import { priorityEvent, priorityDot } from "../utils/taskColors";

const VIEWS = ["day", "week", "month"];

const CalendarPage = () => {
  const navigate = useNavigate();
  const { state } = useBoard();
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(new Date());

  // Flatten all cards into events keyed by dueDate
  const eventsByDate = useMemo(() => {
    const map = {};
    state.boards.forEach((board) => {
      board.lists.forEach((list) => {
        list.cards.forEach((card) => {
          if (!card.dueDate) return;
          const key = card.dueDate.slice(0, 10); // yyyy-mm-dd
          if (!map[key]) map[key] = [];
          map[key].push({
            ...card,
            boardId: board.id,
            boardTitle: board.title,
            listTitle: list.title,
          });
        });
      });
    });
    return map;
  }, [state]);

  const eventsFor = (day) => eventsByDate[format(day, "yyyy-MM-dd")] || [];

  const goPrev = () => {
    if (view === "day") setCursor((c) => subDays(c, 1));
    else if (view === "week") setCursor((c) => subWeeks(c, 1));
    else setCursor((c) => subMonths(c, 1));
  };
  const goNext = () => {
    if (view === "day") setCursor((c) => addDays(c, 1));
    else if (view === "week") setCursor((c) => addWeeks(c, 1));
    else setCursor((c) => addMonths(c, 1));
  };
  const goToday = () => setCursor(new Date());

  // Header label
  const headerLabel = useMemo(() => {
    if (view === "day") return format(cursor, "EEEE, MMMM d, yyyy");
    if (view === "week") {
      const start = startOfWeek(cursor);
      const end = endOfWeek(cursor);
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    }
    return format(cursor, "MMMM yyyy");
  }, [view, cursor]);

  const openEvent = (evt) => navigate(`/board/${evt.boardId}`);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Calendar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {headerLabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm flex">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${
                    view === v
                      ? "bg-[#1e2757] text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
              <button
                onClick={goPrev}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                ‹
              </button>
              <button
                onClick={goToday}
                className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={goNext}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* View Body */}
        <div className="flex-1 overflow-auto">
          {view === "month" && (
            <MonthView
              cursor={cursor}
              eventsFor={eventsFor}
              onEventClick={openEvent}
            />
          )}
          {view === "week" && (
            <WeekView
              cursor={cursor}
              eventsFor={eventsFor}
              onEventClick={openEvent}
            />
          )}
          {view === "day" && (
            <DayView
              cursor={cursor}
              events={eventsFor(cursor)}
              onEventClick={openEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================ MONTH VIEW ============================ */
const MonthView = ({ cursor, eventsFor, onEventClick }) => {
  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-700">
        {dayNames.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, i) => {
          const inMonth = isSameMonth(day, monthStart);
          const today = isToday(day);
          const events = eventsFor(day).slice(0, 3);
          const more = eventsFor(day).length - events.length;

          return (
            <div
              key={i}
              className={`min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-slate-700 last:border-r-0 ${
                !inMonth
                  ? "bg-gray-50/40 dark:bg-slate-800/40"
                  : "bg-white dark:bg-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    today
                      ? "bg-orange-500 text-white"
                      : inMonth
                        ? "text-gray-700 dark:text-gray-200"
                        : "text-gray-300 dark:text-slate-600"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {events.map((evt) => (
                  <EventPill
                    key={evt.id}
                    event={evt}
                    onClick={() => onEventClick(evt)}
                  />
                ))}
                {more > 0 && (
                  <button
                    onClick={() => onEventClick(eventsFor(day)[3])}
                    className="text-[10px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 pl-1"
                  >
                    +{more} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================ WEEK VIEW ============================ */
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

const WeekView = ({ cursor, eventsFor, onEventClick }) => {
  const weekStart = startOfWeek(cursor, { weekStartsOn: 1 }); // Monday
  const days = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header row: day names */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 dark:border-slate-700">
        <div className="py-3" />
        {days.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`py-3 text-center ${
                today ? "bg-orange-50 dark:bg-orange-900/20" : ""
              }`}
            >
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                {format(day, "EEE")}
              </p>
              <p
                className={`text-lg font-bold ${
                  today ? "text-orange-500" : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {format(day, "d")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        {/* Time column */}
        <div className="border-r border-gray-100 dark:border-slate-700">
          {HOURS.map((h) => (
            <div
              key={h}
              className="h-20 border-b border-gray-100 dark:border-slate-700 text-[11px] text-gray-400 text-right pr-2 pt-1"
            >
              {format(new Date().setHours(h, 0), "h a")}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const events = eventsFor(day);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`relative border-r border-gray-100 dark:border-slate-700 last:border-r-0 ${
                today ? "bg-orange-50/40 dark:bg-orange-900/10" : ""
              }`}
            >
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="h-20 border-b border-gray-100 dark:border-slate-700"
                />
              ))}

              {/* Events floating in cells (positioned by order, not by hour for simplicity) */}
              <div className="absolute inset-1 space-y-1 pointer-events-none">
                {events.slice(0, 4).map((evt, idx) => (
                  <div
                    key={evt.id}
                    className="pointer-events-auto"
                    style={{
                      marginTop: `${idx * 3.2}rem`,
                    }}
                  >
                    <WeekEventCard
                      event={evt}
                      onClick={() => onEventClick(evt)}
                    />
                  </div>
                ))}
                {events.length > 4 && (
                  <button
                    onClick={() => onEventClick(events[4])}
                    className="pointer-events-auto text-[10px] font-medium text-gray-500 hover:text-gray-800 bg-white/90 dark:bg-slate-800/90 rounded px-1.5 py-0.5 shadow-sm"
                  >
                    +{events.length - 4} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================ DAY VIEW ============================ */
const DayView = ({ cursor, events, onEventClick }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-[80px_1fr]">
        {/* Time column */}
        <div className="border-r border-gray-100 dark:border-slate-700">
          {HOURS.map((h) => (
            <div
              key={h}
              className="h-24 border-b border-gray-100 dark:border-slate-700 text-[11px] text-gray-400 text-right pr-3 pt-2"
            >
              {format(new Date().setHours(h, 0), "h:mm a")}
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="relative">
          {HOURS.map((h) => (
            <div
              key={h}
              className="h-24 border-b border-gray-100 dark:border-slate-700"
            />
          ))}

          <div className="absolute inset-x-4 top-4 space-y-2">
            {events.length === 0 && (
              <div className="text-sm text-gray-400 dark:text-gray-500">
                No tasks due this day
              </div>
            )}
            {events.map((evt) => (
              <button
                key={evt.id}
                onClick={() => onEventClick(evt)}
                className={`w-full text-left rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${priorityEvent[evt.priority].bg} ${priorityEvent[evt.priority].border}`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      priorityDot[evt.priority] || "bg-gray-400"
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {evt.priority}
                  </span>
                </div>
                <p
                  className={`text-sm font-semibold ${priorityEvent[evt.priority].text}`}
                >
                  {evt.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {evt.boardTitle} · {evt.listTitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================ SHARED PIECES ============================ */
const EventPill = ({ event, onClick }) => {
  const styles = priorityEvent[event.priority] || priorityEvent.medium;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left text-[11px] font-medium px-1.5 py-0.5 rounded ${styles.bg} ${styles.text} hover:opacity-80 truncate`}
      title={event.title}
    >
      {event.title}
    </button>
  );
};

const WeekEventCard = ({ event, onClick }) => {
  const styles = priorityEvent[event.priority] || priorityEvent.medium;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full text-left rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow ${styles.bg} ${styles.border}`}
    >
      <p className={`text-xs font-semibold truncate ${styles.text}`}>
        {event.title}
      </p>
      <p className="text-[10px] text-gray-500 truncate">{event.boardTitle}</p>
    </button>
  );
};

export default CalendarPage;
