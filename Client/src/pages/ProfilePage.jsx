import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BannerUploader from "../components/Profile/BannerUploader";
import AvatarUploader from "../components/Profile/AvatarUploader";
import TagInput from "../components/Profile/TagInput";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import { FiArrowUpRight } from "react-icons/fi";
import LinkIcon from "../components/Profile/LinkIcon";

import {
  COUNTRIES,
  LANGUAGE_SUGGESTIONS,
  SKILL_SUGGESTIONS,
  LINK_META,
  linkHref,
  linkLabel,
  profileStrength,
} from "../utils/profileOptions";

const ICONS = {
  pin: [
    "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z",
    "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  ],
  mail: [
    "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  ],
  phone: [
    "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
  ],
  team: [
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  ],
  calendar: [
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  ],
};

const Icon = ({ name }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-4 h-4 shrink-0 text-gray-400"
  >
    {ICONS[name].map((d) => (
      <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
    ))}
  </svg>
);

const Meta = ({ icon, children }) =>
  children ? (
    <span className="inline-flex items-center gap-2">
      <Icon name={icon} />
      {children}
    </span>
  ) : null;

const Card = ({ title, children, delay = 0 }) => (
  <section
    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 animate-rise"
    style={{ animationDelay: `${delay}ms` }}
  >
    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
      {title}
    </h2>
    {children}
  </section>
);

const Field = ({ label, hint, children, as: Tag = "label" }) => (
  <Tag className="block">
    <span className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1.5">
      {label}
    </span>
    {children}
    {hint && (
      <span className="block text-[11px] text-gray-400 mt-1">{hint}</span>
    )}
  </Tag>
);

const inputCls =
  "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]";

const StrengthRing = ({ percent }) => {
  const C = 2 * Math.PI * 28;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          strokeWidth="6"
          className="stroke-gray-100 dark:stroke-slate-700"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * C} ${C}`}
          style={{
            stroke: "var(--accent)",
            transition: "stroke-dasharray .6s ease",
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-100">
        {percent}%
      </span>
    </div>
  );
};

const toForm = (u) => ({
  name: u?.name || "",
  title: u?.title || "",
  department: u?.department || "",
  phone: u?.phone || "",
  country: u?.country || "",
  city: u?.city || "",
  bio: u?.bio || "",
  skills: u?.skills || [],
  languages: u?.languages || [],
  links: {
    website: "",
    linkedin: "",
    github: "",
    instagram: "",
    ...(u?.links || {}),
  },
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => toForm(user));

  const startEdit = () => {
    setForm(toForm(user)); // always start from the saved profile
    setEditing(true);
  };
  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setLink = (key, value) =>
    setForm((p) => ({ ...p, links: { ...p.links, [key]: value } }));

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name cannot be empty");
    setSaving(true);
    try {
      const { user: updated } = await api.updateProfile({
        name: form.name,
        title: form.title,
        department: form.department,
        phone: form.phone,
        country: form.country,
        city: form.city,
        bio: form.bio,
        skills: form.skills,
        languages: form.languages,
        links: form.links,
      });
      updateUser(updated);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const strength = profileStrength(user);
  const location = [user?.city, user?.country].filter(Boolean).join(", ");
  const links = Object.entries(user?.links || {}).filter(
    ([k, v]) => v && LINK_META[k],
  );
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";
  const countryOptions =
    form.country && !COUNTRIES.includes(form.country)
      ? [form.country, ...COUNTRIES]
      : COUNTRIES;

  return (
    <div className="flex min-h-screen app-bg">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 hover:text-gray-800 dark:hover:text-gray-200"
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

        <div className="max-w-5xl mx-auto">
          {/* Header card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-rise">
            <BannerUploader />

            <div className="px-6 sm:px-8 pb-7">
              <div className="-mt-14 relative z-10 flex items-end justify-between gap-4">
                <AvatarUploader size="large" />

                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="bg-[#1e2757] hover:bg-[#2a3572] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {user?.name || "Unnamed"}
                </h1>
                <p className="text-base text-[var(--accent)] font-medium mt-1">
                  {user?.title || (
                    <span className="text-gray-400 font-normal">
                      Add your job title
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <Meta icon="pin">{location}</Meta>
                  <Meta icon="team">{user?.department}</Meta>
                  <Meta icon="phone">{user?.phone}</Meta>
                  <Meta icon="mail">{user?.email}</Meta>
                  <Meta icon="calendar">
                    {memberSince && `Member since ${memberSince}`}
                  </Meta>
                </div>
              </div>
            </div>
          </div>

          {!editing ? (
            /* ---------------- VIEW ---------------- */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              <div className="space-y-5">
                <Card title="Profile strength" delay={60}>
                  <div className="flex items-center gap-4">
                    <StrengthRing percent={strength.percent} />
                    <div className="min-w-0">
                      {strength.missing.length === 0 ? (
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Your profile is complete 🎉
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-gray-400">Next step</p>
                          <button
                            onClick={startEdit}
                            className="text-sm font-medium text-[var(--accent)] hover:underline text-left"
                          >
                            {strength.missing[0]}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>

                <Card title="On the web" delay={120}>
                  {links.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No links yet.{" "}
                      <button
                        onClick={startEdit}
                        className="text-[var(--accent)] font-medium hover:underline"
                      >
                        Add some
                      </button>
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {links.map(([key, value]) => {
                        const href = linkHref(key, value);
                        const cls =
                          "group flex items-center gap-3 p-2 -mx-2 rounded-xl transition-colors";
                        const inner = (
                          <>
                            <LinkIcon type={key} />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] text-gray-400">
                                {LINK_META[key].label}
                              </p>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                {linkLabel(value)}
                              </p>
                            </div>
                            {href && (
                              <FiArrowUpRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-opacity" />
                            )}
                          </>
                        );
                        return (
                          <li key={key}>
                            {href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${cls} hover:bg-gray-50 dark:hover:bg-slate-700/50`}
                              >
                                {inner}
                              </a>
                            ) : (
                              <div className={cls}>{inner}</div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>

                <Card title="Languages" delay={180}>
                  {user?.languages?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.languages.map((l) => (
                        <span
                          key={l}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Which languages do you speak?{" "}
                      <button
                        onClick={startEdit}
                        className="text-[var(--accent)] font-medium hover:underline"
                      >
                        Add
                      </button>
                    </p>
                  )}
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <Card title="About" delay={100}>
                  {user?.bio ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Tell people what you do and what you're working on.{" "}
                      <button
                        onClick={startEdit}
                        className="text-[var(--accent)] font-medium hover:underline"
                      >
                        Write a short bio
                      </button>
                    </p>
                  )}
                </Card>

                <Card title="Skills" delay={160}>
                  {user?.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Show what you're good at.{" "}
                      <button
                        onClick={startEdit}
                        className="text-[var(--accent)] font-medium hover:underline"
                      >
                        Add skills
                      </button>
                    </p>
                  )}
                </Card>
              </div>
            </div>
          ) : (
            /* ---------------- EDIT ---------------- */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
              <div className="space-y-5">
                <Card title="Basics">
                  <div className="space-y-4">
                    <Field label="Display name">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Job title">
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="e.g. Product Designer"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Department / team">
                      <input
                        type="text"
                        value={form.department}
                        onChange={(e) => set("department", e.target.value)}
                        placeholder="e.g. Marketing"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </Card>

                <Card title="Location & contact">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Country">
                        <select
                          value={form.country}
                          onChange={(e) => set("country", e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Select country</option>
                          {countryOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="City">
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => set("city", e.target.value)}
                          placeholder="e.g. Addis Ababa"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field
                      label="Phone"
                      hint="Only you can see your phone number."
                    >
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+251 ..."
                        className={inputCls}
                      />
                    </Field>
                    <Field
                      label="Email"
                      hint="Your sign-in email can't be changed here."
                    >
                      <input
                        type="text"
                        value={user?.email || ""}
                        disabled
                        className={`${inputCls} opacity-60 cursor-not-allowed`}
                      />
                    </Field>
                  </div>
                </Card>

                <Card title="Languages">
                  <TagInput
                    value={form.languages}
                    onChange={(v) => set("languages", v)}
                    placeholder="Type a language…"
                    suggestions={LANGUAGE_SUGGESTIONS}
                    max={10}
                  />
                </Card>
              </div>

              <div className="space-y-5">
                <Card title="About">
                  <textarea
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value.slice(0, 500))}
                    rows={6}
                    placeholder="A few lines about you, your work and your interests."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-[11px] text-gray-400 mt-1 text-right">
                    {form.bio.length}/500
                  </p>
                </Card>

                <Card title="Skills">
                  <TagInput
                    value={form.skills}
                    onChange={(v) => set("skills", v)}
                    placeholder="Type a skill…"
                    suggestions={SKILL_SUGGESTIONS}
                    max={12}
                  />
                </Card>

                <Card title="On the web">
                  <div className="space-y-3">
                    {Object.entries(LINK_META).map(([key, meta]) => (
                      <div key={key} className="flex items-center gap-3">
                        <LinkIcon type={key} size={40} />
                        <input
                          type="text"
                          value={form.links[key] || ""}
                          onChange={(e) => setLink(key, e.target.value)}
                          placeholder={`${meta.label}: ${meta.placeholder}`}
                          aria-label={meta.label}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
