import { Router } from "express";
import multer from "multer";
import {
  updateMe,
  deleteMe,
  uploadBanner,
  uploadAvatar,
} from "../controllers/userController.js";
import { searchUsers, getPublicProfile } from "../controllers/teamController.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB, same as the client check
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Please choose a JPG, PNG, WebP or GIF image"));
  },
});

// Turns upload problems into a clean message instead of a 500
const single = (field) => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Image must be under 8 MB" : err.message || "Upload failed";
    res.status(400).json({ message });
  });

router.get("/search", searchUsers);
router.get("/:id/profile", getPublicProfile);

router.patch("/me", updateMe);
router.delete("/me", deleteMe);
router.post("/me/banner", single("banner"), uploadBanner);
router.post("/me/avatar", single("avatar"), uploadAvatar);

export default router;