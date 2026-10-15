import { Router } from "express";
import {
  listBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import { createList, reorderLists } from "../controllers/listController.js";
import { requireBoardOwner } from "../middleware/ownership.js";

const router = Router();

router.get("/", listBoards);
router.post("/", createBoard);
router.get("/:id", requireBoardOwner, getBoard);
router.patch("/:id", requireBoardOwner, updateBoard);
router.delete("/:id", requireBoardOwner, deleteBoard);

// Nested: create list
router.post("/:id/lists", requireBoardOwner, createList);

// Reorder lists
router.patch("/:id/lists/reorder", requireBoardOwner, reorderLists);

export default router;