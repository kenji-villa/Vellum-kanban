import { Server } from "socket.io";
import prisma from "./prisma.js";
import { verifyToken } from "./utils/jwt.js";

let io = null;

export const initRealtime = (httpServer, clientOrigin) => {
  io = new Server(httpServer, { cors: { origin: clientOrigin } });

  // Same JWT as the REST API
  io.use((socket, next) => {
    try {
      const payload = verifyToken(socket.handshake.auth?.token);
      socket.data.userId = payload.id;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;
    socket.join(`user:${userId}`);
    try {
      const boards = await prisma.board.findMany({
        where: { OR: [{ userId }, { members: { some: { userId } } }] },
        select: { id: true },
      });
      if (boards.length) socket.join(boards.map((b) => `board:${b.id}`));
    } catch (err) {
      console.error("socket join error:", err);
    }
    console.log(`🔌 socket connected (${userId})`); // remove if you find it noisy
  });

  return io;
};

export const emitToUser = (userId, event, payload = {}) => {
  io?.to(`user:${userId}`).emit(event, payload);
};

// `exceptSocketId` is the tab that made the change; it already knows
export const emitToBoard = (boardId, event, payload = {}, exceptSocketId) => {
  if (!io) return;
  const room = `board:${boardId}`;
  console.log(
    `📣 ${event} → ${room} · ${io.sockets.adapter.rooms.get(room)?.size || 0} socket(s) in room · skipping ${exceptSocketId || "nobody"}`,
  );
  const target = io.to(room);
  (exceptSocketId ? target.except(exceptSocketId) : target).emit(event, payload);
};

export const joinUserToBoard = (userId, boardId) => {
  io?.in(`user:${userId}`).socketsJoin(`board:${boardId}`);
};

export const leaveUserFromBoard = (userId, boardId) => {
  io?.in(`user:${userId}`).socketsLeave(`board:${boardId}`);
};

export const closeBoardRoom = (boardId) => {
  io?.in(`board:${boardId}`).socketsLeave(`board:${boardId}`);
};