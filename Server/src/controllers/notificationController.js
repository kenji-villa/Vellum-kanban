import prisma from "../prisma.js";

const ACTOR = { id: true, name: true, title: true, avatarUrl: true };

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("notification error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/notifications
export const listNotifications = wrap(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
  actor: { select: ACTOR },
  invitation: { select: { id: true, status: true, message: true } },
  board: { select: { id: true, title: true } },
  card: { select: { id: true, title: true } },
},
    }),
    prisma.notification.count({ where: { userId: req.user.id, readAt: null } }),
  ]);
  res.json({ notifications, unreadCount });
});

// POST /api/notifications/:id/read
export const markRead = wrap(async (req, res) => {
  await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.id, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ ok: true });
});

// POST /api/notifications/read-all
export const markAllRead = wrap(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, readAt: null },
    data: { readAt: new Date() },
  });
  res.json({ ok: true });
});