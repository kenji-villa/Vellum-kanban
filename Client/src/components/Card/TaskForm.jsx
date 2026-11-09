import React, { useState, useEffect } from "react";
import { DEFAULT_LABELS, LABEL_COLORS, COLOR_KEYS } from "../../utils/labels";

const TaskForm = ({
  initialValues,
  onSubmit,
  onCancel,
  people = [],
  boardLabels = [],
  onCreateLabel,
  onDeleteLabel,
  readOnly = false,
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    labels: [],
    assignee: "",
    assigneeId: "",
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title || "",
        description: initialValues.description || "",
        priority: initialValues.priority || "medium",
        dueDate: initialValues.dueDate || "",
        labels: initialValues.labels || [],
        assignee: initialValues.assignee || "",
        assigneeId: initialValues.assigneeId || "",
      });
    }
  }, [initialValues]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleLabel = (label) => {
    setForm((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("teal");
  const [creating, setCreating] = useState(false);
  const [labelError, setLabelError] = useState("");
  const allLabels = [...DEFAULT_LABELS, ...boardLabels];
  const assignable = people.filter((p) => p.role !== "viewer");

  const createLabel = async () => {
    const name = newName.trim();
    if (!name) return;
    if (allLabels.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
      setLabelError("That label already exists");
      return;
    }
    setCreating(true);
    setLabelError("");
    try {
      const label = await onCreateLabel(name, newColor);
      setForm((p) => ({ ...p, labels: [...p.labels, label.name] })); // select it right away
      setNewName("");
      setAdding(false);
    } catch (err) {
      setLabelError(err.message || "Couldn't add label");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteLabel = async (l) => {
    if (
      !window.confirm(
        `Delete the label "${l.name}"? It will be removed from every task on this board.`,
      )
    )
      return;
    try {
      await onDeleteLabel(l);
      setForm((p) => ({ ...p, labels: p.labels.filter((x) => x !== l.name) }));
    } catch (err) {
      setLabelError(err.message || "Couldn't delete label");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset disabled={readOnly} className="contents space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Design homepage"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Create responsive homepage..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        {/* Priority + Due Date row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            value={form.assigneeId}
            onChange={(e) => {
              const p = assignable.find((x) => x.id === e.target.value);
              setForm((prev) => ({
                ...prev,
                assigneeId: e.target.value,
                assignee: p ? p.name : "",
              }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Unassigned</option>
            {assignable.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {allLabels.map((l) => {
              const active = form.labels.includes(l.name);
              const c = LABEL_COLORS[l.color] || LABEL_COLORS.gray;
              return (
                <span key={l.name} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleLabel(l.name)}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all ${
                      active
                        ? `${c.pill} border-transparent ring-2 ${c.ring}`
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    {l.name}
                  </button>
                  {l.id && onDeleteLabel && (
                    <button
                      type="button"
                      title="Delete label"
                      onClick={() => handleDeleteLabel(l)}
                      className="ml-1 text-sm leading-none text-gray-300 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}

            {onCreateLabel && (
              <button
                type="button"
                onClick={() => setAdding((v) => !v)}
                className="text-xs px-3 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
              >
                + New label
              </button>
            )}
          </div>

          {adding && (
            <div className="mt-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 24))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createLabel();
                  }
                  if (e.key === "Escape") setAdding(false);
                }}
                placeholder="Label name"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {COLOR_KEYS.map((k) => (
                  <button
                    type="button"
                    key={k}
                    aria-label={k}
                    onClick={() => setNewColor(k)}
                    className={`w-6 h-6 rounded-full ${LABEL_COLORS[k].dot} ${
                      newColor === k ? "ring-2 ring-offset-2 ring-gray-400" : ""
                    }`}
                  />
                ))}
              </div>
              {labelError && (
                <p className="text-xs text-red-500 mt-2">{labelError}</p>
              )}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setLabelError("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createLabel}
                  disabled={creating || !newName.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                >
                  {creating ? "Adding…" : "Add label"}
                </button>
              </div>
            </div>
          )}
          {!adding && labelError && (
            <p className="text-xs text-red-500 mt-2">{labelError}</p>
          )}
        </div>

        {/* Actions */}
        {!readOnly && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </button>
          </div>
        )}
      </fieldset>
    </form>
  );
};

export default TaskForm;
