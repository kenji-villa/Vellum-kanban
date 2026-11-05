import prisma from "../prisma.js";
import { shapeCard } from "../utils/shapeCard.js";

const DEFAULT_LISTS = ["To Do", "In Progress", "Done"];
const PUBLIC_USER = { id: true, name: true, title: true, avatarUrl: true };

// GET /api/boards: boards you own or were added to
export const listBoards = async (req, res) => {
  try {
    const me = req.user.id;
    const boards = await prisma.board.findMany({
      where: { OR: [{ userId: me }, { members: { some: { userId: me } } }] },
      orderBy: { createdAt: "asc" },
      include: { lists: { select: { _count: { select: { cards: true } } } } },
    });

    res.json({
      boards: boards.map((b) => ({
        id: b.id,
        title: b.title,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        lists: b.lists.map((l) => ({ _count: l._count })),
      })),
    });
  } catch (err) {
    console.error("listBoards error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/boards/:id (access checked by middleware)
export const getBoard = async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: PUBLIC_USER },
        members: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: PUBLIC_USER } },
        },
        lists: {
          orderBy: { position: "asc" },
          include: { cards: { orderBy: { position: "asc" } } },
        },
      },
    });
    if (!board) return res.status(404).json({ message: "Board not found" });

    res.json({
      board: {
        id: board.id,
        title: board.title,
        role: req.boardRole,
        owner: board.user,
        members: board.members.map((m) => m.user),
        lists: board.lists.map((l) => ({
          id: l.id,
          title: l.title,
          cards: l.cards.map(shapeCard),
        })),
      },
    });
  } catch (err) {
    console.error("getBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/boards
export const createBoard = async (req, res) => {
  try {
    const title = (req.body?.title || "Untitled Board").trim();

    const board = await prisma.board.create({
      data: {
        title,
        userId: req.user.id,
        lists: {
          create: DEFAULT_LISTS.map((t, i) => ({ title: t, position: i })),
        },
      },
      include: { lists: { orderBy: { position: "asc" } } },
    });

    res.status(201).json({
      board: {
        id: board.id,
        title: board.title,
        role: "owner",
        owner: { id: req.user.id },
        members: [],
        lists: board.lists.map((l) => ({ id: l.id, title: l.title, cards: [] })),
      },
    });
  } catch (err) {
    console.error("createBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/boards/:id (owner only)
export const updateBoard = async (req, res) => {
  try {
    const title = (req.body?.title || "").trim();
    if (!title) return res.status(400).json({ message: "Title required" });

    const board = await prisma.board.update({
      where: { id: req.params.id },
      data: { title },
    });
    res.json({ board: { id: board.id, title: board.title } });
  } catch (err) {
    console.error("updateBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE /api/boards/:id (owner only)
export const deleteBoard = async (req, res) => {
  try {
    await prisma.board.delete({ where: { id: req.params.id } });
    res.json({ message: "Board deleted" });
  } catch (err) {
    console.error("deleteBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};