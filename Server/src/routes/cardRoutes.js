import { Router } from "express";
import { updateCard, deleteCard, moveCard } from "../controllers/cardController.js";
import { requireCardAccess } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireCardAccess, updateCard);
router.delete("/:id", requireCardAccess, deleteCard);
router.patch("/:id/move", requireCardAccess, moveCard);

export default router;