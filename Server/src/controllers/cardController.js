import prisma from "../prisma.js";
import { shapeCard } from "../utils/shapeCard.js";

const isOnBoard = async (boardId, userId) => {
  const b = await prisma.board.findFirst({
    where: { id: boardId, OR: [{ userId }, { members: { some: { userId } } }] },
    select: { id: true },
  });
  return !!b;
};

const notifyAssigned = async (card, boardId, actorId, assigneeId) => {
  if (!assigneeId || assigneeId === actorId) return;
  await prisma.notification.create({
    data: {
      userId: assigneeId,
      type: "TASK_ASSIGNED",
      actorId,
      boardId,
      cardId: card.id,
    },
  });
};

// POST /api/lists/:id/cards
export const createCard = async (req, res) => {
  try {
    const {
      title = "New Task",
      description = "",
      priority = "medium",
      dueDate,
      labels = [],
      assignee = "",
      assigneeId,
    } = req.body || {};

    let assigneeUserId = null;
    if (assigneeId) {
      if (!(await isOnBoard(req.boardId, assigneeId))) {
        return res.status(400).json({ message: "That person isn't on this board" });
      }
      assigneeUserId = assigneeId;
    }

    const last = await prisma.card.findFirst({
      where: { listId: req.params.id },
      orderBy: { position: "desc" },
    });
    const position = last ? last.position + 1 : 0;

    const card = await prisma.card.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        labels,
        assignee,
        assigneeId: assigneeUserId,
        position,
        listId: req.params.id,
      },
    });

    await notifyAssigned(card, req.boardId, req.user.id, assigneeUserId);
    res.status(201).json({ card: shapeCard(card) });
  } catch (err) {
    console.error("createCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/cards/:id
export const updateCard = async (req, res) => {
  try {
    const allowed = ["title", "description", "priority", "dueDate", "labels", "assignee", "comments"];
    const data = {};
    for (const key of allowed) {
      if (key in req.body) {
        data[key] =
          key === "dueDate"
            ? req.body[key]
              ? new Date(req.body[key])
              : null
            : req.body[key];
      }
    }

    let newlyAssigned = null;
    if ("assigneeId" in req.body) {
      const id = req.body.assigneeId || null;
      if (id && !(await isOnBoard(req.boardId, id))) {
        return res.status(400).json({ message: "That person isn't on this board" });
      }
      data.assigneeId = id;
      if (id && id !== req.card.assigneeId) newlyAssigned = id;
    }

    const card = await prisma.card.update({ where: { id: req.params.id }, data });
    if (newlyAssigned) await notifyAssigned(card, req.boardId, req.user.id, newlyAssigned);

    res.json({ card: shapeCard(card) });
  } catch (err) {
    console.error("updateCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE /api/cards/:id
export const deleteCard = async (req, res) => {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error("deleteCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/cards/:id/move   Body: { toListId, toIndex }
export const moveCard = async (req, res) => {
  try {
    const { toListId, toIndex } = req.body;
    if (!toListId || typeof toIndex !== "number") {
      return res.status(400).json({ message: "toListId and toIndex required" });
    }

    const card = req.card;
    const fromListId = card.listId;

    // The target list must be on the same board
    const toList = await prisma.list.findUnique({ where: { id: toListId } });
    if (!toList || toList.boardId !== req.boardId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.card.update({ where: { id: card.id }, data: { listId: toListId } });

      const destCards = await tx.card.findMany({
        where: { listId: toListId, id: { not: card.id } },
        orderBy: { position: "asc" },
      });

      const newOrder = [...destCards];
      newOrder.splice(toIndex, 0, card);

      for (let i = 0; i < newOrder.length; i++) {
        await tx.card.update({ where: { id: newOrder[i].id }, data: { position: i } });
      }

      if (fromListId !== toListId) {
        const fromCards = await tx.card.findMany({
          where: { listId: fromListId },
          orderBy: { position: "asc" },
        });
        for (let i = 0; i < fromCards.length; i++) {
          await tx.card.update({ where: { id: fromCards[i].id }, data: { position: i } });
        }
      }
    });

    res.json({ message: "Moved" });
  } catch (err) {
    console.error("moveCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};