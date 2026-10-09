import React, { useRef, useState } from "react";
import { useBoard } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import ConfirmDialog from "../UI/ConfirmDialog";

const TabData = () => {
  const { state, dispatch } = useBoard();
  const toast = useToast();
  const fileRef = useRef(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Compute storage size
  const storageBytes = new Blob([JSON.stringify(state)]).size;
  const storageKB = (storageBytes / 1024).toFixed(1);

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vellum-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.boards || !Array.isArray(parsed.boards)) {
          throw new Error("Invalid format");
        }
        // Dispatch a raw replace — we'll use RESET_STATE then merge
        // Simpler: replace the boards array via a full state set.
        // Since reducer only has RESET_STATE, we'll do a full reset first then add.
        // Actually cleaner: add a REPLACE_STATE action (see Step 5).
        dispatch({ type: "REPLACE_STATE", payload: parsed });
        toast.success("Data imported successfully");
      } catch (err) {
        toast.error("Import failed — invalid file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    dispatch({ type: "RESET_STATE" });
    toast.info("All data reset to defaults");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Data Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Back up, restore, or clear your Vellum data. Everything is stored
          locally on your device.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Storage usage */}
      <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Storage Used
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {storageKB} KB · Local browser storage
          </p>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {storageKB}{" "}
          <span className="text-sm font-normal text-gray-400">KB</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <ActionRow
          title="Export data"
          description="Download all your boards, lists, and cards as a JSON backup."
          buttonLabel="Export"
          onClick={handleExport}
        />
        <ActionRow
          title="Import data"
          description="Restore from a previous Vellum backup file. This will replace current data."
          buttonLabel="Import"
          onClick={() => fileRef.current?.click()}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
        <ActionRow
          title="Reset all data"
          description="Delete everything and start from the default sample board. This cannot be undone."
          buttonLabel="Reset"
          danger
          onClick={() => setConfirmReset(true)}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Reset all data?"
        message="This will permanently delete every board, list, and card you've created. Consider exporting a backup first."
        confirmText="Reset Everything"
      />
    </div>
  );
};

const ActionRow = ({ title, description, buttonLabel, onClick, danger }) => (
  <div className="flex items-center justify-between gap-4 p-4 border border-gray-100 dark:border-slate-700 rounded-xl">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {title}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {description}
      </p>
    </div>
    <button
      onClick={onClick}
      className={`text-sm font-medium px-4 py-2 rounded-lg shrink-0 transition-colors ${
        danger
          ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
      }`}
    >
      {buttonLabel}
    </button>
  </div>
);

export default TabData;
