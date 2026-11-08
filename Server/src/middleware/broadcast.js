import prisma from "../prisma.js";
import { emitToBoard, emitToUser, closeBoardRoom } from "../realtime.js";

// After every successful write: tell the board's room to re-fetch, and tell
// anyone who just received a notification.
export const broadcastChanges = (req, res, next) => {
  if (req.method === "GET") return next();

  const startedAt = new Date(Date.now() - 1500);
  const socketId = req.get("x-socket-id") || undefined;

  res.on("finish", async () => {
    if (res.statusCode >= 400) return;
    try {
      const boardId = req.boardId || req.board?.id; // set by the access guards
      if (boardId) {
        emitToBoard(
          boardId,
          "board:changed",
          { boardId, cardId: req.card?.id || null, by: req.user?.id },
          socketId,
        );

        // A deleted board: nobody should stay in its room
        const deletedBoard =
          req.method === "DELETE" &&
          req.baseUrl === "/api/boards" &&
          req.route?.path === "/:id";
        if (deletedBoard) setTimeout(() => closeBoardRoom(boardId), 500);
      }

      const fresh = await prisma.notification.findMany({
        where: { createdAt: { gte: startedAt } },
        select: { userId: true },
        distinct: ["userId"],
      });
      fresh.forEach((n) => emitToUser(n.userId, "notifications:new"));
    } catch (err) {
      console.error("broadcast error:", err);
    }
  });

  next();
};