import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BannerUploader from "../components/Profile/BannerUploader";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();
  const { user } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    userTitle: "",
    userBio: "",
  });

  useEffect(() => {
    setForm({
      userName: settings.userName || "",
      userTitle: settings.userTitle || "",
      userBio: settings.userBio || "",
    });
  }, [settings.userName, settings.userTitle, settings.userBio]);

  const initials = (settings.userName || user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.userName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    updateSetting("userName", form.userName.trim());
    updateSetting("userTitle", form.userTitle.trim());
    updateSetting("userBio", form.userBio.trim());
    toast.success("Profile updated");
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      userName: settings.userName || "",
      userTitle: settings.userTitle || "",
      userBio: settings.userBio || "",
    });
    setEditing(false);
  };

  const remaining = 300 - (form.userBio?.length || 0);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Header card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Banner */}
            <BannerUploader
              banner={settings.userBanner}
              onUpload={(dataUrl) => updateSetting("userBanner", dataUrl)}
              onRemove={() => updateSetting("userBanner", "")}
            />

            {/* Avatar + actions */}
            <div className="px-6 pb-6">
              <div className="-mt-0 flex items-end justify-between gap-4 mb-5">
                <div className="w-30 h-30 rounded-full bg-orange-500 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl shrink-0">
                  {initials}
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-[#1e2757] hover:bg-[#151c45] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit Profile
                  </button>
                )}

                {editing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-sm font-medium px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* View / Edit body */}
              {!editing ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {settings.userName || "Unnamed User"}
                  </h1>
                  {settings.userTitle && (
                    <p className="text-sm text-orange-500 font-medium mt-1">
                      {settings.userTitle}
                    </p>
                  )}
                  {settings.userBio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4 whitespace-pre-line">
                      {settings.userBio}
                    </p>
                  )}
                  {!settings.userBio && !settings.userTitle && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 italic">
                      No profile details yet. Click Edit Profile to add some.
                    </p>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Email"
                      value={user?.email || "—"}
                      icon={
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
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                      }
                    />
                    <InfoItem
                      label="Member since"
                      value={
                        user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )
                          : "—"
                      }
                      icon={
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
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={form.userName}
                      onChange={(e) => handleChange("userName", e.target.value)}
                      placeholder="Juliana Reyes"
                      autoFocus
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={form.userTitle}
                      onChange={(e) =>
                        handleChange("userTitle", e.target.value)
                      }
                      placeholder="Product Designer"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={form.userBio}
                      onChange={(e) =>
                        handleChange("userBio", e.target.value.slice(0, 300))
                      }
                      rows={4}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      {remaining} characters left
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Boards shared with you and activity will appear here in a future
              update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
      {icon}
      {label}
    </div>
    <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{value}</p>
  </div>
);

export default ProfilePage;
