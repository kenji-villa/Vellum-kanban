import prisma from "../prisma.js";
import { leaveUserFromBoard, emitToUser } from "../realtime.js";

const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // wait before re-inviting someone who declined
const PUBLIC_USER = { id: true, name: true, title: true, avatarUrl: true };

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("team error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const maskEmail = (email = "") => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "";
  return `${local[0]}***@${domain}`;
};

// How is `meId` related to each of `ids`? Missing key = no relation.
const relationsFor = async (meId, ids) => {
  const rows = await prisma.invitation.findMany({
    where: {
      OR: [
        { senderId: meId, receiverId: { in: ids } },
        { receiverId: meId, senderId: { in: ids } },
      ],
    },
  });
  const map = {};
  for (const r of rows) {
    const otherId = r.senderId === meId ? r.receiverId : r.senderId;
    if (r.status === "ACCEPTED") {
      map[otherId] = { relation: "teammate", invitationId: r.id };
    } else if (r.status === "PENDING") {
      map[otherId] = {
        relation: r.senderId === meId ? "invited" : "invited_you",
        invitationId: r.id,
      };
    }
  }
  return map;
};

const doAccept = (inv, meId) =>
  prisma.$transaction([
    prisma.invitation.update({
      where: { id: inv.id },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    }),
    prisma.notification.updateMany({
      where: { invitationId: inv.id, userId: meId, readAt: null },
      data: { readAt: new Date() },
    }),
    prisma.notification.create({
      data: {
        userId: inv.senderId,
        type: "INVITE_ACCEPTED",
        actorId: meId,
        invitationId: inv.id,
      },
    }),
  ]);

// GET /api/users/search?q=
export const searchUsers = wrap(async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (q.length < 2) return res.json({ users: [] });

  const users = await prisma.user.findMany({
    where: {
      id: { not: req.user.id },
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { equals: q, mode: "insensitive" } },
      ],
    },
    select: { ...PUBLIC_USER, email: true },
    orderBy: { name: "asc" },
    take: 8,
  });

  const rel = await relationsFor(req.user.id, users.map((u) => u.id));
  res.json({
    users: users.map(({ email, ...u }) => ({
      ...u,
      emailHint: maskEmail(email),
      relation: rel[u.id]?.relation || "none",
      invitationId: rel[u.id]?.invitationId || null,
    })),
  });
});

// GET /api/users/:id/profile
export const getPublicProfile = wrap(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
  ...PUBLIC_USER,
  bio: true,
  bannerUrl: true,
  createdAt: true,
  department: true,
  country: true,
  city: true,
  languages: true,
  skills: true,
  links: true,
},
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  const rel = await relationsFor(req.user.id, [user.id]);
  res.json({
    user: {
      ...user,
      relation: user.id === req.user.id ? "self" : rel[user.id]?.relation || "none",
      invitationId: rel[user.id]?.invitationId || null,
    },
  });
});

// GET /api/team
export const getTeam = wrap(async (req, res) => {
  const me = req.user.id;
  const rows = await prisma.invitation.findMany({
    where: {
      OR: [{ senderId: me }, { receiverId: me }],
      status: { in: ["ACCEPTED", "PENDING"] },
    },
    include: {
      sender: { select: PUBLIC_USER },
      receiver: { select: PUBLIC_USER },
    },
    orderBy: { createdAt: "desc" },
  });

  const members = [];
  const sent = [];
  const received = [];
  for (const r of rows) {
    const other = r.senderId === me ? r.receiver : r.sender;
    const item = {
      invitationId: r.id,
      user: other,
      message: r.message,
      createdAt: r.createdAt,
      since: r.respondedAt,
    };
    if (r.status === "ACCEPTED") members.push(item);
    else if (r.senderId === me) sent.push(item);
    else received.push(item);
  }
  res.json({ members, sent, received });
});

// POST /api/team/invitations  { receiverId, message? }
export const sendInvitation = wrap(async (req, res) => {
  const me = req.user.id;
  const { receiverId } = req.body;
  const message =
    typeof req.body.message === "string" ? req.body.message.trim().slice(0, 200) : "";

  if (!receiverId || receiverId === me) {
    return res.status(400).json({ message: "Invalid user" });
  }
  const target = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });
  if (!target) return res.status(404).json({ message: "User not found" });

  const existing = await prisma.invitation.findFirst({
    where: {
      OR: [
        { senderId: me, receiverId },
        { senderId: receiverId, receiverId: me },
      ],
    },
  });

  if (existing) {
    const mine = existing.senderId === me;
    if (existing.status === "ACCEPTED") {
      return res.status(409).json({ message: "You're already teammates" });
    }
    if (existing.status === "PENDING" && mine) {
      return res.status(409).json({ message: "Invitation already sent" });
    }
    if (existing.status === "PENDING" && !mine) {
      // They already invited you, so just accept theirs
      await doAccept(existing, me);
      return res.json({ status: "accepted" });
    }
    // DECLINED
    const respondedAt = new Date(existing.respondedAt || existing.createdAt).getTime();
    if (mine && Date.now() - respondedAt < COOLDOWN_MS) {
      return res
        .status(429)
        .json({ message: "This person declined recently. Try again later." });
    }
    await prisma.invitation.delete({ where: { id: existing.id } });
  }

  const invitation = await prisma.invitation.create({
    data: { senderId: me, receiverId, message: message || null },
  });
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: "INVITE_RECEIVED",
      actorId: me,
      invitationId: invitation.id,
    },
  });
  res.status(201).json({ status: "sent", invitationId: invitation.id });
});

const respond = (action) =>
  wrap(async (req, res) => {
    const inv = await prisma.invitation.findUnique({ where: { id: req.params.id } });
    if (!inv || inv.receiverId !== req.user.id) {
      return res.status(404).json({ message: "Invitation not found" });
    }
    if (inv.status !== "PENDING") {
      return res.status(409).json({ message: "This invitation was already answered" });
    }

    if (action === "accept") {
      await doAccept(inv, req.user.id);
    } else {
      await prisma.$transaction([
        prisma.invitation.update({
          where: { id: inv.id },
          data: { status: "DECLINED", respondedAt: new Date() },
        }),
        prisma.notification.updateMany({
          where: { invitationId: inv.id, userId: req.user.id, readAt: null },
          data: { readAt: new Date() },
        }),
      ]);
    }
    res.json({ status: action === "accept" ? "accepted" : "declined" });
  });

export const acceptInvite = respond("accept");
export const declineInvite = respond("decline");

// DELETE /api/team/invitations/:id  (sender cancels a pending invite)
export const cancelInvitation = wrap(async (req, res) => {
  const inv = await prisma.invitation.findUnique({ where: { id: req.params.id } });
  if (!inv || inv.senderId !== req.user.id || inv.status !== "PENDING") {
    return res.status(404).json({ message: "Invitation not found" });
  }
  await prisma.invitation.delete({ where: { id: inv.id } });
  res.json({ ok: true });
});

// DELETE /api/team/members/:userId
export const removeTeammate = wrap(async (req, res) => {
  const me = req.user.id;
  const other = req.params.userId;
  const { count } = await prisma.invitation.deleteMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: me, receiverId: other },
        { senderId: other, receiverId: me },
      ],
    },
  });
  if (!count) return res.status(404).json({ message: "Teammate not found" });
  // Removing a teammate also removes shared access between you, both ways
const sharedWhere = {
  OR: [
    { userId: other, board: { userId: me } },
    { userId: me, board: { userId: other } },
  ],
};
const sharedLinks = await prisma.boardMember.findMany({
  where: sharedWhere,
  select: { userId: true, boardId: true },
});
await prisma.boardMember.deleteMany({ where: sharedWhere });
await prisma.card.updateMany({
  where: {
    OR: [
      { assigneeId: other, list: { board: { userId: me } } },
      { assigneeId: me, list: { board: { userId: other } } },
    ],
  },
  data: { assigneeId: null, assignee: "" },
});
sharedLinks.forEach((l) => leaveUserFromBoard(l.userId, l.boardId));
emitToUser(me, "boards:changed");
emitToUser(other, "boards:changed");
  res.json({ ok: true });
});