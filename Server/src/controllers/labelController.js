import prisma from "../prisma.js";

const COLORS = ["pink", "purple", "blue", "red", "green", "orange", "yellow", "teal", "indigo", "gray"];
const BUILT_IN = ["design", "ui", "development", "bug", "system", "research", "marketing", "shipped"];
const MAX_LABELS_PER_BOARD = 30;

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("label error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/boards/:id/labels  { name, color }
export const createLabel = wrap(async (req, res) => {
  const name = String(req.body?.name || "").trim().slice(0, 24);
  const color = COLORS.includes(req.body?.color) ? req.body.color : "gray";
  if (!name) return res.status(400).json({ message: "Label name is required" });
  if (BUILT_IN.includes(name.toLowerCase())) {
    return res.status(409).json({ message: "That label already exists" });
  }

  const boardId = req.board.id;
  const duplicate = await prisma.boardLabel.findFirst({
    where: { boardId, name: { equals: name, mode: "insensitive" } },
  });
  if (duplicate) return res.status(409).json({ message: "That label already exists" });

  const count = await prisma.boardLabel.count({ where: { boardId } });
  if (count >= MAX_LABELS_PER_BOARD) {
    return res.status(400).json({ message: "This board has reached its label limit" });
  }

  const label = await prisma.boardLabel.create({ data: { boardId, name, color } });
  res.status(201).json({ label: { id: label.id, name: label.name, color: label.color } });
});

// DELETE /api/boards/:id/labels/:labelId
export const deleteLabel = wrap(async (req, res) => {
  const label = await prisma.boardLabel.findFirst({
    where: { id: req.params.labelId, boardId: req.board.id },
  });
  if (!label) return res.status(404).json({ message: "Label not found" });

  // Remove the label from every card on this board, then delete it
  const cards = await prisma.card.findMany({
    where: { labels: { has: label.name }, list: { boardId: req.board.id } },
    select: { id: true, labels: true },
  });
  await prisma.$transaction([
    ...cards.map((c) =>
      prisma.card.update({
        where: { id: c.id },
        data: { labels: c.labels.filter((l) => l !== label.name) },
      }),
    ),
    prisma.boardLabel.delete({ where: { id: label.id } }),
  ]);
  res.json({ ok: true });
});