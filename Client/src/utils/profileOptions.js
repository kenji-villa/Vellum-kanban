const EXCLUDED_REGIONS = new Set([
  "AC", "CP", "DG", "EA", "EU", "EZ", "IC", "TA", "UN", "QO", "XA", "XB", "ZZ",
  "AN", "BU", "CS", "DD", "FX", "NT", "SU", "TP", "YD", "YU", "ZR",
]);

const FALLBACK_COUNTRIES = [
  "Ethiopia", "Kenya", "Uganda", "Egypt", "Nigeria", "South Africa",
  "United States", "United Kingdom", "Germany", "France", "India", "China",
];

// Country names come from the browser's built-in region names
export const COUNTRIES = (() => {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    const names = new Set();
    for (let a = 65; a <= 90; a++) {
      for (let b = 65; b <= 90; b++) {
        const code = String.fromCharCode(a, b);
        if (EXCLUDED_REGIONS.has(code)) continue;
        try {
          const name = dn.of(code);
          if (name && name !== code) names.add(name);
        } catch {
          /* skip invalid code */
        }
      }
    }
    return names.size > 100
      ? [...names].sort((x, y) => x.localeCompare(y))
      : FALLBACK_COUNTRIES;
  } catch {
    return FALLBACK_COUNTRIES;
  }
})();

export const LANGUAGE_SUGGESTIONS = (() => {
  const codes = ["en", "am", "om", "ti", "so", "ar", "fr", "es", "de", "it", "pt", "ru", "zh", "hi", "tr", "sw"];
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    return codes.map((c) => dn.of(c));
  } catch {
    return ["English", "Amharic", "Oromo", "Tigrinya", "Somali", "Arabic", "French", "Spanish"];
  }
})();

export const SKILL_SUGGESTIONS = [
  "Project Management", "UI Design", "Web Development", "Marketing",
  "Data Analysis", "Writing", "Customer Support", "Public Speaking",
];

export const LINK_META = {
  website: { label: "Website", badge: "🌐", placeholder: "yourwebsite.com", base: "https://" },
  linkedin: { label: "LinkedIn", badge: "in", placeholder: "linkedin.com/in/you or username", base: "https://linkedin.com/in/" },
  github: { label: "GitHub", badge: "GH", placeholder: "username", base: "https://github.com/" },
  twitter: { label: "X / Twitter", badge: "X", placeholder: "@username", base: "https://x.com/" },
};

// Builds a safe href, or null. Blocks javascript:, data: and other schemes.
export const linkHref = (key, value = "") => {
  const v = String(value).trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null;
  if (key === "website" || /^(www\.|[\w-]+\.[a-z]{2,}\/)/i.test(v)) return `https://${v}`;
  return `${LINK_META[key].base}${v.replace(/^@/, "")}`;
};

export const linkLabel = (value = "") =>
  String(value).trim().replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

// Percent complete + what's still missing
export const profileStrength = (u = {}) => {
  const checks = [
    { label: "Add a profile photo", done: !!u.avatarUrl },
    { label: "Add a banner", done: !!u.bannerUrl },
    { label: "Add your job title", done: !!u.title },
    { label: "Write a short bio", done: !!u.bio },
    { label: "Add your location", done: !!(u.country || u.city) },
    { label: "List your skills", done: (u.skills?.length || 0) > 0 },
    { label: "Add the languages you speak", done: (u.languages?.length || 0) > 0 },
    { label: "Link your profiles", done: Object.values(u.links || {}).some(Boolean) },
  ];
  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
};