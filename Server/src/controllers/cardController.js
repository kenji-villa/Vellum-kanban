import prisma from "../prisma.js";
import { shapeCard } from "../utils/shapeCard.js";
import { logActivity } from "../utils/activity.js";

// Owner or editor of the board (viewers can't be assigned work)
const findEditor = (boardId, userId) =>
  prisma.user.findFirst({
    where: {
      id: userId,
      OR: [
        { boards: { some: { id: boardId } } },
        { boardMemberships: { some: { boardId, role: "EDITOR" } } },
      ],
    },
    select: { id: true, name: true },
  });

const fmtDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);

const notifyAssigned = async (card, boardId, actorId, assigneeId) => {
  if (!assigneeId || assigneeId === actorId) return;
  await prisma.notification.create({
    data: { userId: assigneeId, type: "TASK_ASSIGNED", actorId, boardId, cardId: card.id },
  });
};

// POST /api/lists/:id/cards
export const createCard = async (req, res) => {
  try {
    const me = req.user.id;
    const {
      title = "New Task",
      description = "",
      priority = "medium",
      dueDate,
      labels = [],
      assignee = "",
      assigneeId,
    } = req.body || {};

    let person = null;
    if (assigneeId) {
      person = await findEditor(req.boardId, assigneeId);
      if (!person) {
        return res.status(400).json({ message: "That person can't be assigned on this board" });
      }
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
        assignee: assignee || person?.name || "",
        assigneeId: person?.id || null,
        assignedById: person ? me : null,
        position,
        listId: req.params.id,
      },
    });

    await logActivity(null, { cardId: card.id, boardId: req.boardId, actorId: me, type: "CREATED" });
    if (person) {
      await logActivity(null, {
        cardId: card.id,
        boardId: req.boardId,
        actorId: me,
        type: "ASSIGNED",
        meta: { toId: person.id, toName: person.name },
      });
    }
    await notifyAssigned(card, req.boardId, me, person?.id);

    res.status(201).json({ card: shapeCard(card) });
  } catch (err) {
    console.error("createCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/cards/:id
export const updateCard = async (req, res) => {
  try {
    const me = req.user.id;
    const old = req.card;
    const allowed = ["title", "description", "priority", "dueDate", "labels", "assignee"];
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

    const events = [];
    let newlyAssigned = null;

    if ("assigneeId" in req.body) {
      const id = req.body.assigneeId || null;
      if (id !== old.assigneeId) {
        let person = null;
        if (id) {
          person = await findEditor(req.boardId, id);
          if (!person) {
            return res.status(400).json({ message: "That person can't be assigned on this board" });
          }
        }
        data.assigneeId = id;
        data.assignedById = id ? me : null; // remember who handed the task out
        if (old.status === "SUBMITTED") {
          data.status = "OPEN"; // new person, so they have to submit again
          data.submittedAt = null;
        }
        if (id) {
          newlyAssigned = id;
          events.push({ type: "ASSIGNED", meta: { toId: id, toName: person.name } });
        } else {
          events.push({ type: "UNASSIGNED", meta: { fromName: old.assignee || null } });
        }
      }
    }

    if ("priority" in data && data.priority !== old.priority) {
      events.push({ type: "PRIORITY", meta: { from: old.priority, to: data.priority } });
    }
    if ("dueDate" in data && fmtDate(data.dueDate) !== fmtDate(old.dueDate)) {
      events.push({ type: "DUE", meta: { from: fmtDate(old.dueDate), to: fmtDate(data.dueDate) } });
    }

    const card = await prisma.card.update({ where: { id: old.id }, data });

    for (const e of events) {
      await logActivity(null, { cardId: card.id, boardId: req.boardId, actorId: me, ...e });
    }
    if (newlyAssigned) await notifyAssigned(card, req.boardId, me, newlyAssigned);

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

    if (fromListId !== toListId) {
      await logActivity(null, {
        cardId: card.id,
        boardId: req.boardId,
        actorId: req.user.id,
        type: "MOVED",
        meta: { from: card.list.title, to: toList.title },
      });
    }

    res.json({ message: "Moved" });
  } catch (err) {
    console.error("moveCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};