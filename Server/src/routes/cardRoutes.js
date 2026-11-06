import { Router } from "express";
import { updateCard, deleteCard, moveCard } from "../controllers/cardController.js";
import { requireCardAccess } from "../middleware/ownership.js";
import { transitionCard } from "../controllers/cardWorkflowController.js";

const router = Router();

router.patch("/:id", requireCardAccess, updateCard);
router.delete("/:id", requireCardAccess, deleteCard);
router.patch("/:id/move", requireCardAccess, moveCard);
router.post("/:id/status", requireCardAccess, transitionCard);

export default router;