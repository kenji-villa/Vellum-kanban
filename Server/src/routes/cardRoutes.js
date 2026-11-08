import { Router } from "express";
import { updateCard, deleteCard, moveCard } from "../controllers/cardController.js";
import { transitionCard } from "../controllers/cardWorkflowController.js";
import {
  listCardActivity,
  addComment,
  deleteComment,
} from "../controllers/activityController.js";
import { requireCardAccess, requireCardWrite } from "../middleware/ownership.js";

const router = Router();

router.patch("/:id", requireCardWrite, updateCard);
router.delete("/:id", requireCardWrite, deleteCard);
router.patch("/:id/move", requireCardWrite, moveCard);
router.post("/:id/status", requireCardWrite, transitionCard);

router.get("/:id/activity", requireCardAccess, listCardActivity);
router.post("/:id/comments", requireCardWrite, addComment);
router.delete("/:id/comments/:commentId", requireCardWrite, deleteComment);

export default router;