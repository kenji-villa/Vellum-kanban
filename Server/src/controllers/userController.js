import prisma from "../prisma.js";

// PATCH /api/users/me
export const updateMe = async (req, res) => {
  try {
    const { name, title, bio } = req.body;
    
    // Build update object with only provided fields
    const data = {};
    if (name !== undefined) data.name = name;
    if (title !== undefined) data.title = title;
    if (bio !== undefined) data.bio = bio;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        bio: user.bio,
        bannerUrl: user.bannerUrl,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
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