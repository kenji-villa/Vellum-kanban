import { Router } from "express";
import {
  updateCard,
  deleteCard,
  moveCard,
} from "../controllers/cardController.js";
import { requireCardOwner } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireCardOwner, updateCard);
router.delete("/:id", requireCardOwner, deleteCard);
router.patch("/:id/move", requireCardOwner, moveCard);

export default router;