import prisma from "../prisma.js";

// POST /api/boards/:id/lists
export const createList = async (req, res) => {
  try {
    const title = (req.body?.title || "New List").trim();

    // position = last + 1
    const last = await prisma.list.findFirst({
      where: { boardId: req.params.id },
      orderBy: { position: "desc" },
    });
    const position = last ? last.position + 1 : 0;

    const list = await prisma.list.create({
      data: { title, boardId: req.params.id, position },
    });

    res.status(201).json({
      list: { id: list.id, title: list.title, cards: [] },
    });
  } catch (err) {
    console.error("createList error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/lists/:id
export const updateList = async (req, res) => {
  try {
    const title = (req.body?.title || "").trim();
    if (!title) return res.status(400).json({ message: "Title required" });

    const list = await prisma.list.update({
      where: { id: req.params.id },
      data: { title },
    });

    res.json({ list: { id: list.id, title: list.title } });
  } catch (err) {
    console.error("updateList error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE /api/lists/:id
export const deleteList = async (req, res) => {
  try {
    await prisma.list.delete({ where: { id: req.params.id } });
    res.json({ message: "List deleted" });
  } catch (err) {
    console.error("deleteList error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/boards/:id/lists/reorder
// Body: { order: [listId1, listId2, ...] }
export const reorderLists = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order))
      return res.status(400).json({ message: "order must be an array" });

    // Update positions in a transaction
    await prisma.$transaction(
      order.map((listId, index) =>
        prisma.list.update({
          where: { id: listId },
          data: { position: index },
        })
      )
    );

    res.json({ message: "Reordered" });
  } catch (err) {
    console.error("reorderLists error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};