import { Router } from "express";
import { updateList, deleteList } from "../controllers/listController.js";
import { createCard } from "../controllers/cardController.js";
import { requireListWrite } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireListWrite, updateList);
router.delete("/:id", requireListWrite, deleteList);
router.post("/:id/cards", requireListWrite, createCard);

export default router;