import React from "react";

const LandingPreview = () => (
  <section
    id="preview"
    className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50 relative overflow-hidden"
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
          See it in action
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Three views, one workspace
        </h2>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
          Switch between Kanban, Calendar, and Analytics with one click. Every
          view stays in sync with your tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kanban Mock */}
        <PreviewCard
          label="Kanban Board"
          description="Drag, drop, and organize your workflow visually."
        >
          <div className="flex gap-3">
            {["To Do", "In Progress", "Done"].map((title, i) => (
              <div key={title} className="flex-1">
                <div className="bg-[#1e2757] text-white text-[10px] font-semibold rounded-t-md px-2 py-1.5 truncate">
                  {title}
                </div>
                <div className="bg-gray-100 dark:bg-slate-700/50 rounded-b-md p-1.5 space-y-1.5 min-h-[140px]">
                  {[1, 2, 3].slice(0, 3 - i).map((j) => (
                    <div
                      key={j}
                      className="bg-white dark:bg-slate-800 rounded-md p-1.5"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ["bg-red-500", "bg-amber-500", "bg-emerald-500"][i]
                          }`}
                        />
                        <div className="h-1.5 w-8 bg-gray-200 dark:bg-slate-600 rounded" />
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded" />
                      <div className="h-2 w-2/3 bg-gray-100 dark:bg-slate-700 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>

        {/* Calendar Mock */}
        <PreviewCard
          label="Calendar View"
          description="See your due dates across days, weeks, and months."
        >
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                className="text-center text-[9px] font-bold text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const hasEvent = [3, 8, 12, 17, 22, 25].includes(i + 1);
              const isToday = i + 1 === 9;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-md flex items-start justify-end p-0.5 text-[9px] font-medium relative ${
                    isToday
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {i + 1}
                  {hasEvent && !isToday && (
                    <span className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-orange-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </PreviewCard>
      </div>
    </div>
  </section>
);

const PreviewCard = ({ label, description, children }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
    <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
      {description}
    </p>
    {children}
  </div>
);

export default LandingPreview;
