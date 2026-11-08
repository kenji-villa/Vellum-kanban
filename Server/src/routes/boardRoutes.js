import { Router } from "express";
import {
  listBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import { createList, reorderLists } from "../controllers/listController.js";
import {
  listMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "../controllers/boardMemberController.js";
import { createLabel, deleteLabel } from "../controllers/labelController.js";
import { listBoardActivity } from "../controllers/activityController.js";
import {
  requireBoardAccess,
  requireBoardWrite,
  requireBoardOwner,
} from "../middleware/ownership.js";

const router = Router();

router.get("/", listBoards);
router.post("/", createBoard);
router.get("/:id", requireBoardAccess, getBoard);
router.patch("/:id", requireBoardOwner, updateBoard);
router.delete("/:id", requireBoardOwner, deleteBoard);

router.post("/:id/lists", requireBoardWrite, createList);
router.patch("/:id/lists/reorder", requireBoardWrite, reorderLists);

router.get("/:id/members", requireBoardAccess, listMembers);
router.post("/:id/members", requireBoardOwner, addMember);
router.patch("/:id/members/:userId", requireBoardOwner, updateMemberRole);
router.delete("/:id/members/:userId", requireBoardAccess, removeMember);

router.post("/:id/labels", requireBoardWrite, createLabel);
router.delete("/:id/labels/:labelId", requireBoardWrite, deleteLabel);

router.get("/:id/activity", requireBoardAccess, listBoardActivity);

export default router;