import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { updateMe, uploadBanner,uploadAvatar  } from "../controllers/userController.js";

const router = Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `banner-${req.user.id}-${Date.now()}${ext}`);
  },
});

// Filter to images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.patch("/me", updateMe);
router.post("/me/banner", upload.single("banner"), uploadBanner);
router.post("/me/avatar", upload.single("avatar"), uploadAvatar);

export default router;