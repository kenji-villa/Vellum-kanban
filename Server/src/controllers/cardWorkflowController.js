import prisma from "../prisma.js";
import { shapeCard } from "../utils/shapeCard.js";
import { logActivity } from "../utils/activity.js";

const isOnBoard = async (boardId, userId) => {
  const b = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [{ userId }, { members: { some: { userId, role: "EDITOR" } } }],
    },
    select: { id: true },
  });
  return !!b;
};

// Who reviews this card? The person who assigned it (unless they assigned it
// to themselves). If they left the board, the owner reviews instead.
const findReviewerId = async (card, boardId, ownerId) => {
  const assigner = card.assignedById;
  if (!assigner || assigner === card.assigneeId) return null;
  if (await isOnBoard(boardId, assigner)) return assigner;
  return ownerId !== card.assigneeId ? ownerId : null;
};

// POST /api/cards/:id/status  { action: "submit" | "approve" | "request_changes" | "reopen", note? }
export const transitionCard = async (req, res) => {
  try {
    const me = req.user.id;
    const card = req.card;
    const action = req.body?.action;
    const note =
      typeof req.body?.note === "string" ? req.body.note.trim().slice(0, 200) : "";

    const board = await prisma.board.findUnique({
      where: { id: req.boardId },
      select: { userId: true },
    });

    const isAssignee = !!card.assigneeId && card.assigneeId === me;
    const canReview =
      req.boardRole === "owner" || card.assignedById === me || !card.assigneeId;
    const now = new Date();

    let data;
    const notifications = [];

    switch (action) {
      case "submit": {
        if (!isAssignee) {
          return res.status(403).json({ message: "Only the assignee can submit this task" });
        }
        if (card.status !== "OPEN") {
          return res.status(409).json({ message: "This task isn't open" });
        }
        const reviewerId = await findReviewerId(card, req.boardId, board.userId);
        if (reviewerId) {
          data = { status: "SUBMITTED", submittedAt: now };
          notifications.push({ userId: reviewerId, type: "TASK_SUBMITTED", note });
        } else {
          data = { status: "DONE", submittedAt: null, completedAt: now };
        }
        break;
      }
      case "approve": {
        if (!canReview) {
          return res.status(403).json({ message: "You can't review this task" });
        }
        if (card.status === "DONE") {
          return res.status(409).json({ message: "This task is already done" });
        }
        data = { status: "DONE", completedAt: now };
        if (card.assigneeId && card.assigneeId !== me) {
          notifications.push({ userId: card.assigneeId, type: "TASK_APPROVED", note });
        }
        break;
      }
      case "request_changes": {
        if (!canReview) {
          return res.status(403).json({ message: "You can't review this task" });
        }
        if (card.status !== "SUBMITTED") {
          return res.status(409).json({ message: "This task isn't waiting for review" });
        }
        data = { status: "OPEN", submittedAt: null };
        if (card.assigneeId && card.assigneeId !== me) {
          notifications.push({
            userId: card.assigneeId,
            type: "TASK_CHANGES_REQUESTED",
            note,
          });
        }
        break;
      }
      case "reopen": {
        if (!canReview && !isAssignee) {
          return res.status(403).json({ message: "You can't reopen this task" });
        }
        if (card.status !== "DONE") {
          return res.status(409).json({ message: "This task isn't done" });
        }
        data = { status: "OPEN", submittedAt: null, completedAt: null };
        break;
      }
      default:
        return res.status(400).json({ message: "Unknown action" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.card.update({ where: { id: card.id }, data });
      await logActivity(tx, {
  cardId: card.id,
  boardId: req.boardId,
  actorId: me,
  type: "STATUS",
  body: note,
  meta: { action, status: data.status },
});
      for (const n of notifications) {
        await tx.notification.create({
          data: {
            userId: n.userId,
            type: n.type,
            note: n.note || null,
            actorId: me,
            boardId: req.boardId,
            cardId: card.id,
          },
        });
      }
      return c;
    });

    res.json({ card: shapeCard(updated) });
  } catch (err) {
    console.error("transitionCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};