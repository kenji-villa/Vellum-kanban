import prisma from "../prisma.js";

/**
 * Loads a board by :id and attaches it to req.board.
 * Only succeeds if req.user owns it.
 */
export const requireBoardOwner = async (req, res, next) => {
  try {
    const boardId = req.params.id || req.params.boardId;
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    req.board = board;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Loads a list by :id, checks it belongs to a board owned by req.user.
 */
export const requireListOwner = async (req, res, next) => {
  try {
    const list = await prisma.list.findUnique({
      where: { id: req.params.id },
      include: { board: true },
    });
    if (!list) return res.status(404).json({ message: "List not found" });
    if (list.board.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    req.list = list;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Loads a card by :id, checks it belongs to a list -> board owned by req.user.
 */
export const requireCardOwner = async (req, res, next) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { list: { include: { board: true } } },
    });
    if (!card) return res.status(404).json({ message: "Card not found" });
    if (card.list.board.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });
    req.card = card;
    next();
  } catch (err) {
    next(err);
  }
};