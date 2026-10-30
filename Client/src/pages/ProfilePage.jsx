import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BannerUploader from "../components/Profile/BannerUploader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import AvatarUploader from "../components/Profile/AvatarUploader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    title: user?.title || "",
    bio: user?.bio || "",
  });

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name cannot be empty");
    setSaving(true);
    try {
      // Ensure we are sending the exact keys
      const { user: updated } = await api.updateProfile({
        name: form.name,
        title: form.title,
        bio: form.bio,
      });
      updateUser(updated);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 hover:text-gray-800"
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <BannerUploader />

            <div className="px-6 pb-6">
              <div className="-mt-14 relative z-10 flex items-end justify-between gap-4 mb-5">
                <AvatarUploader size="large" />

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-[#1e2757] text-white text-sm font-medium px-4 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm bg-orange-500 text-white disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {!editing ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user?.name || "Unnamed"}
                  </h1>
                  {user?.title && (
                    <p className="text-sm text-orange-500 font-medium mt-1">
                      {user.title}
                    </p>
                  )}
                  {user?.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-4 whitespace-pre-line">
                      {user.bio}
                    </p>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                        Member since
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        handleChange("bio", e.target.value.slice(0, 300))
                      }
                      rows={4}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
