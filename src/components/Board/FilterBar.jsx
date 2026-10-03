import React, { useState, useRef, useEffect } from "react";
import {
  PRIORITIES,
  LABELS,
  DUE_FILTERS,
  emptyFilters,
  countActiveFilters,
} from "../../utils/filters";

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const FilterBar = ({
  query,
  setQuery,
  filters,
  setFilters,
  visible,
  total,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const togglePriority = (p) => {
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(p)
        ? prev.priorities.filter((x) => x !== p)
        : [...prev.priorities, p],
    }));
  };

  const toggleLabel = (l) => {
    setFilters((prev) => ({
      ...prev,
      labels: prev.labels.includes(l)
        ? prev.labels.filter((x) => x !== l)
        : [...prev.labels, l],
    }));
  };

  const toggleDue = (d) => {
    setFilters((prev) => ({
      ...prev,
      due: prev.due.includes(d)
        ? prev.due.filter((x) => x !== d)
        : [...prev.due, d],
    }));
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setQuery("");
  };

  const activeCount = countActiveFilters(filters);
  const hasAnyFilter = activeCount > 0 || query.trim().length > 0;

  return (
    <div className="mb-4">
      {/* Search + Filter Button Row */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-white pl-10 pr-9 py-2 text-sm rounded-lg shadow-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Button + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              dropdownOpen || activeCount > 0
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            Filter
            {activeCount > 0 && (
              <span className="bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-30 p-4 max-h-[70vh] overflow-y-auto">
              {/* Priority */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wide mb-2">
                  Priority
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => {
                    const active = filters.priorities.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${priorityDot[p]}`}
                        />
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Labels */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wide mb-2">
                  Labels
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {LABELS.map((l) => {
                    const active = filters.labels.includes(l);
                    return (
                      <button
                        key={l}
                        onClick={() => toggleLabel(l)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wide mb-2">
                  Due Date
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(DUE_FILTERS).map(([key, label]) => {
                    const active = filters.due.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleDue(key)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear */}
              {activeCount > 0 && (
                <button
                  onClick={() => setFilters(emptyFilters)}
                  className="w-full text-xs font-medium text-gray-500 hover:text-red-600 py-2 border-t border-gray-100 mt-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="text-xs text-gray-500 whitespace-nowrap">
          {hasAnyFilter ? (
            <>
              Showing{" "}
              <span className="font-semibold text-gray-800">{visible}</span> of{" "}
              <span className="font-semibold text-gray-800">{total}</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-800">{total}</span> tasks
            </>
          )}
        </div>

        {/* Clear All */}
        {hasAnyFilter && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-red-600 font-medium whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {filters.priorities.map((p) => (
            <FilterChip
              key={`p-${p}`}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              onRemove={() => togglePriority(p)}
            />
          ))}
          {filters.labels.map((l) => (
            <FilterChip
              key={`l-${l}`}
              label={l}
              onRemove={() => toggleLabel(l)}
            />
          ))}
          {filters.due.map((d) => (
            <FilterChip
              key={`d-${d}`}
              label={DUE_FILTERS[d]}
              onRemove={() => toggleDue(d)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-1 rounded-full">
    {label}
    <button
      onClick={onRemove}
      className="hover:bg-blue-200 rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none"
    >
      ×
    </button>
  </span>
);

export default FilterBar;
