import prisma from "../prisma.js";

// Returns { board, role } where role is "owner", "member" or null
export const roleOnBoard = async (boardId, userId) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: {
      id: true,
      userId: true,
      members: { where: { userId }, select: { id: true } },
    },
  });
  if (!board) return { board: null, role: null };
  if (board.userId === userId) return { board, role: "owner" };
  return { board, role: board.members.length ? "member" : null };
};

const guardBoard = (ownerOnly) => async (req, res, next) => {
  try {
    const boardId = req.params.id || req.params.boardId;
    const { board, role } = await roleOnBoard(boardId, req.user.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (!role || (ownerOnly && role !== "owner")) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.board = board;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};

// Owner or member
export const requireBoardAccess = guardBoard(false);
// Owner only
export const requireBoardOwner = guardBoard(true);

export const requireListAccess = async (req, res, next) => {
  try {
    const list = await prisma.list.findUnique({ where: { id: req.params.id } });
    if (!list) return res.status(404).json({ message: "List not found" });
    const { role } = await roleOnBoard(list.boardId, req.user.id);
    if (!role) return res.status(403).json({ message: "Forbidden" });
    req.list = list;
    req.boardId = list.boardId;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireCardAccess = async (req, res, next) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { list: true },
    });
    if (!card) return res.status(404).json({ message: "Card not found" });
    const { role } = await roleOnBoard(card.list.boardId, req.user.id);
    if (!role) return res.status(403).json({ message: "Forbidden" });
    req.card = card;
    req.boardId = card.list.boardId;
    req.boardRole = role;
    next();
  } catch (err) {
    next(err);
  }
};