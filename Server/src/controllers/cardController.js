import prisma from "../prisma.js";

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
    } = req.body || {};

    // position = last in list + 1
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
        position,
        listId: req.params.id,
      },
    });

    res.status(201).json({
      card: {
        id: card.id,
        title: card.title,
        description: card.description,
        priority: card.priority,
        dueDate: card.dueDate ? card.dueDate.toISOString().slice(0, 10) : "",
        labels: card.labels,
        assignee: card.assignee,
        comments: card.comments,
      },
    });
  } catch (err) {
    console.error("createCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/cards/:id
export const updateCard = async (req, res) => {
  try {
    const allowed = [
      "title",
      "description",
      "priority",
      "dueDate",
      "labels",
      "assignee",
      "comments",
    ];
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

    const card = await prisma.card.update({
      where: { id: req.params.id },
      data,
    });

    res.json({
      card: {
        id: card.id,
        title: card.title,
        description: card.description,
        priority: card.priority,
        dueDate: card.dueDate ? card.dueDate.toISOString().slice(0, 10) : "",
        labels: card.labels,
        assignee: card.assignee,
        comments: card.comments,
      },
    });
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

// PATCH /api/cards/:id/move
// Body: { toListId, toIndex }
export const moveCard = async (req, res) => {
  try {
    const { toListId, toIndex } = req.body;
    if (!toListId || typeof toIndex !== "number")
      return res
        .status(400)
        .json({ message: "toListId and toIndex required" });

    const card = req.card; // from middleware
    const fromListId = card.listId;

    // Confirm target list belongs to the same user
    const toList = await prisma.list.findUnique({
      where: { id: toListId },
      include: { board: true },
    });
    if (!toList || toList.board.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await prisma.$transaction(async (tx) => {
      // 1. Remove card from old position
      await tx.card.update({
        where: { id: card.id },
        data: { listId: toListId },
      });

      // 2. Fetch destination list's cards (excluding the moved one)
      const destCards = await tx.card.findMany({
        where: { listId: toListId, id: { not: card.id } },
        orderBy: { position: "asc" },
      });

      // 3. Splice moved card into destination index
      const newOrder = [...destCards];
      newOrder.splice(toIndex, 0, card);

      // 4. Rewrite positions
      for (let i = 0; i < newOrder.length; i++) {
        await tx.card.update({
          where: { id: newOrder[i].id },
          data: { position: i },
        });
      }

      // 5. Compact old list positions
      if (fromListId !== toListId) {
        const fromCards = await tx.card.findMany({
          where: { listId: fromListId },
          orderBy: { position: "asc" },
        });
        for (let i = 0; i < fromCards.length; i++) {
          await tx.card.update({
            where: { id: fromCards[i].id },
            data: { position: i },
          });
        }
      }
    });

    res.json({ message: "Moved" });
  } catch (err) {
    console.error("moveCard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};