import prisma from "../prisma.js";

// Returns { board, role } where role is "owner", "member" or null
export const roleOnBoard = async (boardId, userId) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: {
      id: true,
      userId: true,
      members: { where: { userId }, select: { role: true } },
    },
  });
  if (!board) return { board: null, role: null };
  if (board.userId === userId) return { board, role: "owner" };
  if (!board.members.length) return { board, role: null };
  return { board, role: board.members[0].role === "VIEWER" ? "viewer" : "editor" };
};

const allows = (role, level) => {
  if (!role) return false;
  if (level === "owner") return role === "owner";
  if (level === "write") return role === "owner" || role === "editor";
  return true; // "read"
};

const deny = (res, role) =>
  res.status(403).json({
    message: role === "viewer" ? "You have view-only access to this board" : "Forbidden",
  });

const guardBoard = (level) => async (req, res, next) => {
  try {
    const boardId = req.params.id || req.params.boardId;
    const { board, role } = await roleOnBoard(boardId, req.user.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (!allows(role, level)) return deny(res, role);
    req.board = board;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireBoardAccess = guardBoard("read"); 
export const requireBoardWrite = guardBoard("write"); 
export const requireBoardOwner = guardBoard("owner");


const guardList = (level) => async (req, res, next) => {
  try {
    const list = await prisma.list.findUnique({ where: { id: req.params.id } });
    if (!list) return res.status(404).json({ message: "List not found" });
    const { role } = await roleOnBoard(list.boardId, req.user.id);
    if (!allows(role, level)) return deny(res, role);
    req.list = list;
    req.boardId = list.boardId;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};
export const requireListAccess = guardList("read");
export const requireListWrite = guardList("write");

const guardCard = (level) => async (req, res, next) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { list: true },
    });
    if (!card) return res.status(404).json({ message: "Card not found" });
    const { role } = await roleOnBoard(card.list.boardId, req.user.id);
    if (!allows(role, level)) return deny(res, role);
    req.card = card;
    req.boardId = card.list.boardId;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};
export const requireCardAccess = guardCard("read");
export const requireCardWrite = guardCard("write");