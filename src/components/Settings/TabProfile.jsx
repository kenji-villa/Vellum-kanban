import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";

const TabProfile = () => {
  const { settings, updateSetting } = useSettings();
  const toast = useToast();

  const handleSave = () => {
    toast.success("Profile updated");
  };

  const initials = settings.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Profile
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your personal details. This is displayed on your dashboard.
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Avatar */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {initials || "V"}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            Your avatar
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Automatically generated from your name initials.
          </p>
        </div>
      </div>

      {/* Display name */}
      <Field label="Display Name">
        <input
          type="text"
          value={settings.userName}
          onChange={(e) => updateSetting("userName", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </Field>

      {/* Job title */}
      <Field label="Job Title">
        <input
          type="text"
          value={settings.userTitle}
          onChange={(e) => updateSetting("userTitle", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </Field>

      {/* Bio */}
      <Field label="Bio">
        <textarea
          rows={4}
          value={settings.userBio}
          onChange={(e) => updateSetting("userBio", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          {300 - settings.userBio.length} characters left
        </p>
      </Field>

      <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
    </div>
    <div>{children}</div>
  </div>
);

export default TabProfile;
