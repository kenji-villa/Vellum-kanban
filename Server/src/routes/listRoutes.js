import { Router } from "express";
import { updateList, deleteList } from "../controllers/listController.js";
import { createCard } from "../controllers/cardController.js";
import { requireListOwner } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireListOwner, updateList);
router.delete("/:id", requireListOwner, deleteList);

// Nested: create card
router.post("/:id/cards", requireListOwner, createCard);

export default router;