import prisma from "../prisma.js";
import { joinUserToBoard, leaveUserFromBoard, emitToUser } from "../realtime.js";

const PUBLIC_USER = { id: true, name: true, title: true, avatarUrl: true };

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("boardMember error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const parseRole = (r) => (r === "viewer" ? "VIEWER" : "EDITOR");

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
    members: board.members.map((m) => ({ ...m.user, role: m.role.toLowerCase() })),
    role: req.boardRole,
  });
});

// POST /api/boards/:id/members  { userId, role }  (owner only)
export const addMember = wrap(async (req, res) => {
  const me = req.user.id;
  const { userId } = req.body;
  if (!userId || userId === me) {
    return res.status(400).json({ message: "Invalid user" });
  }
  const role = parseRole(req.body.role);

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
    prisma.boardMember.create({ data: { boardId: req.board.id, userId, role } }),
    prisma.notification.create({
      data: {
        userId,
        type: "BOARD_SHARED",
        actorId: me,
        boardId: req.board.id,
        note: role === "VIEWER" ? "You have view-only access" : null,
      },
    }),
  ]);
  joinUserToBoard(userId, req.board.id);
emitToUser(userId, "boards:changed");
  res.status(201).json({ ok: true });
});

// PATCH /api/boards/:id/members/:userId  { role }  (owner only)
export const updateMemberRole = wrap(async (req, res) => {
  const role = parseRole(req.body.role);
  const target = req.params.userId;
  const { count } = await prisma.boardMember.updateMany({
    where: { boardId: req.board.id, userId: target },
    data: { role },
  });
  if (!count) return res.status(404).json({ message: "Member not found" });

  // Viewers can't be assigned work
  if (role === "VIEWER") {
    await prisma.card.updateMany({
      where: { assigneeId: target, list: { boardId: req.board.id } },
      data: { assigneeId: null, assignee: "" },
    });
  }
  res.json({ ok: true });
});

// DELETE /api/boards/:id/members/:userId  
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
  leaveUserFromBoard(target, req.board.id);
emitToUser(target, "boards:changed");
  res.json({ ok: true });
});