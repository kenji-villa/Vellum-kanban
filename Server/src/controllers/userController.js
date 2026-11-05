import prisma from "../prisma.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

const cleanTags = (arr, { maxItems = 12, maxLen = 30 } = {}) => {
  if (!Array.isArray(arr)) return undefined;
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const t = typeof raw === "string" ? raw.trim().slice(0, maxLen) : "";
    const k = t.toLowerCase();
    if (t && !seen.has(k)) {
      seen.add(k);
      out.push(t);
    }
    if (out.length >= maxItems) break;
  }
  return out;
};

const LINK_KEYS = ["website", "linkedin", "github", "instagram"];
const cleanLinks = (obj) => {
  if (!obj || typeof obj !== "object") return undefined;
  const out = {};
  for (const k of LINK_KEYS) {
    const v = typeof obj[k] === "string" ? obj[k].trim().slice(0, 100) : "";
    if (v && !/^\s*(javascript|data|vbscript):/i.test(v)) out[k] = v;
  }
  return out;
};


// PATCH /api/users/me
export const updateMe = async (req, res) => {
  try {
    const b = req.body;
    const data = {};

    const name = str(b.name, 80);
    if (name !== undefined) {
      if (!name) return res.status(400).json({ message: "Name cannot be empty" });
      data.name = name;
    }

    const limits = { title: 80, department: 80, phone: 30, country: 60, city: 60, bio: 500 };
    for (const [key, max] of Object.entries(limits)) {
      const v = str(b[key], max);
      if (v !== undefined) data[key] = v; 
    }

    if (data.phone && !/^[+\d\s().-]+$/.test(data.phone)) {
      return res.status(400).json({ message: "Phone number looks invalid" });
    }

    const languages = cleanTags(b.languages);
    if (languages !== undefined) data.languages = languages;
    const skills = cleanTags(b.skills);
    if (skills !== undefined) data.skills = skills;
    const links = cleanLinks(b.links);
    if (links !== undefined) data.links = links;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/users/me/banner
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const bannerUrl = `/uploads/${req.file.filename}`;
    console.log("Attempting to save banner URL to DB:", bannerUrl); // Debug log

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { bannerUrl: bannerUrl },
    });

    res.json({
      message: "Banner updated",
      bannerUrl: user.bannerUrl,
    });
  } catch (err) {
    console.error("uploadBanner FAILED:", err); 
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

// POST /api/users/me/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    console.log("Attempting to save avatar URL to DB:", avatarUrl);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
    });

    res.json({
      message: "Avatar updated",
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    console.error("uploadAvatar FAILED:", err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};