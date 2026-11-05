import prisma from "../prisma.js";

const PUBLIC_USER = { id: true, name: true, title: true, avatarUrl: true };

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("boardMember error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/boards/:id/members
export const listMembers = wrap(async (req, res) => {
  const board = await prisma.board.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: PUBLIC_USER },
      members: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: PUBLIC_USER } },
      },
    },
  });
  res.json({
    owner: board.user,
    members: board.members.map((m) => m.user),
    role: req.boardRole,
  });
});

// POST /api/boards/:id/members  { userId }  (owner only)
export const addMember = wrap(async (req, res) => {
  const me = req.user.id;
  const { userId } = req.body;
  if (!userId || userId === me) {
    return res.status(400).json({ message: "Invalid user" });
  }

  const teammate = await prisma.invitation.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: me, receiverId: userId },
        { senderId: userId, receiverId: me },
      ],
    },
  });
  if (!teammate) {
    return res.status(403).json({ message: "You can only share boards with your teammates" });
  }

  const existing = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId: req.board.id, userId } },
  });
  if (existing) return res.status(409).json({ message: "Already on this board" });

  await prisma.$transaction([
    prisma.boardMember.create({ data: { boardId: req.board.id, userId } }),
    prisma.notification.create({
      data: { userId, type: "BOARD_SHARED", actorId: me, boardId: req.board.id },
    }),
  ]);
  res.status(201).json({ ok: true });
});

// DELETE /api/boards/:id/members/:userId  (owner removes anyone; members remove themselves)
export const removeMember = wrap(async (req, res) => {
  const target = req.params.userId;
  if (target !== req.user.id && req.boardRole !== "owner") {
    return res.status(403).json({ message: "Only the owner can remove people" });
  }
  if (target === req.board.userId) {
    return res.status(400).json({ message: "The owner can't be removed" });
  }

  await prisma.$transaction([
    prisma.boardMember.deleteMany({ where: { boardId: req.board.id, userId: target } }),
    prisma.card.updateMany({
      where: { assigneeId: target, list: { boardId: req.board.id } },
      data: { assigneeId: null, assignee: "" },
    }),
  ]);
  res.json({ ok: true });
});