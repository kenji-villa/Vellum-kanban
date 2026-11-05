import { Router } from "express";
import {
  listBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import { createList, reorderLists } from "../controllers/listController.js";
import { listMembers, addMember, removeMember } from "../controllers/boardMemberController.js";
import { requireBoardAccess, requireBoardOwner } from "../middleware/ownership.js";

const router = Router();

router.get("/", listBoards);
router.post("/", createBoard);
router.get("/:id", requireBoardAccess, getBoard);
router.patch("/:id", requireBoardOwner, updateBoard);
router.delete("/:id", requireBoardOwner, deleteBoard);

router.post("/:id/lists", requireBoardAccess, createList);
router.patch("/:id/lists/reorder", requireBoardAccess, reorderLists);

router.get("/:id/members", requireBoardAccess, listMembers);
router.post("/:id/members", requireBoardOwner, addMember);
router.delete("/:id/members/:userId", requireBoardAccess, removeMember);

export default router;