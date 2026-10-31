import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { signup, login, me, googleAuth } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/google", googleAuth);

export default router;