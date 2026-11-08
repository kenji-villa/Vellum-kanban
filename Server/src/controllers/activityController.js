import prisma from "../prisma.js";

const ACTOR = { id: true, name: true, title: true, avatarUrl: true };

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("activity error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const shape = (a) => ({
  id: a.id,
  type: a.type,
  body: a.body,
  meta: a.meta,
  createdAt: a.createdAt,
  actor: a.actor,
  cardId: a.cardId,
  cardTitle: a.card?.title ?? null,
});

// GET /api/cards/:id/activity: oldest first
export const listCardActivity = wrap(async (req, res) => {
  const rows = await prisma.cardActivity.findMany({
    where: { cardId: req.params.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { actor: { select: ACTOR } },
  });
  res.json({ activity: rows.reverse().map(shape) });
});

// GET /api/boards/:id/activity: newest first
export const listBoardActivity = wrap(async (req, res) => {
  const rows = await prisma.cardActivity.findMany({
    where: { boardId: req.params.id },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { actor: { select: ACTOR }, card: { select: { title: true } } },
  });
  res.json({ activity: rows.map(shape) });
});

// POST /api/cards/:id/comments  { body }
export const addComment = wrap(async (req, res) => {
  const me = req.user.id;
  const body =
    typeof req.body?.body === "string" ? req.body.body.trim().slice(0, 1000) : "";
  if (!body) return res.status(400).json({ message: "Write something first" });

  const card = req.card;

  // Who should hear about it: assignee, assigner and earlier commenters
  const earlier = await prisma.cardActivity.findMany({
    where: { cardId: card.id, type: "COMMENT", actorId: { not: null } },
    select: { actorId: true },
    distinct: ["actorId"],
  });
  const candidates = new Set(
    [card.assigneeId, card.assignedById, ...earlier.map((e) => e.actorId)].filter(Boolean),
  );
  candidates.delete(me);

  const recipients = candidates.size
    ? await prisma.user.findMany({
        where: {
          id: { in: [...candidates] },
          OR: [
            { boards: { some: { id: req.boardId } } },
            { boardMemberships: { some: { boardId: req.boardId } } },
          ],
        },
        select: { id: true },
      })
    : [];

  const { activity, count } = await prisma.$transaction(async (tx) => {
    const activity = await tx.cardActivity.create({
      data: { cardId: card.id, boardId: req.boardId, actorId: me, type: "COMMENT", body },
      include: { actor: { select: ACTOR } },
    });
    const count = await tx.cardActivity.count({
      where: { cardId: card.id, type: "COMMENT" },
    });
    await tx.card.update({ where: { id: card.id }, data: { comments: count } });
    if (recipients.length) {
      await tx.notification.createMany({
        data: recipients.map((r) => ({
          userId: r.id,
          type: "COMMENT_ADDED",
          actorId: me,
          boardId: req.boardId,
          cardId: card.id,
          note: body.slice(0, 120),
        })),
      });
    }
    return { activity, count };
  });

  res.status(201).json({ activity: shape(activity), commentCount: count });
});

// DELETE /api/cards/:id/comments/:commentId  (author, or the board owner)
export const deleteComment = wrap(async (req, res) => {
  const a = await prisma.cardActivity.findFirst({
    where: { id: req.params.commentId, cardId: req.card.id, type: "COMMENT" },
  });
  if (!a) return res.status(404).json({ message: "Comment not found" });
  if (a.actorId !== req.user.id && req.boardRole !== "owner") {
    return res.status(403).json({ message: "You can only delete your own comments" });
  }

  const count = await prisma.$transaction(async (tx) => {
    await tx.cardActivity.delete({ where: { id: a.id } });
    const n = await tx.cardActivity.count({
      where: { cardId: req.card.id, type: "COMMENT" },
    });
    await tx.card.update({ where: { id: req.card.id }, data: { comments: n } });
    return n;
  });
  res.json({ commentCount: count });
});