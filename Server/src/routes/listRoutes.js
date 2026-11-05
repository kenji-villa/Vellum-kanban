// Server/src/routes/listRoutes.js
import { Router } from "express";
import { updateList, deleteList } from "../controllers/listController.js";
import { createCard } from "../controllers/cardController.js";
import { requireListAccess } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireListAccess, updateList);
router.delete("/:id", requireListAccess, deleteList);
router.post("/:id/cards", requireListAccess, createCard);

export default router;