import prisma from "../prisma.js";

const DEFAULT_LISTS = ["To Do", "In Progress", "Done"];

// GET /api/boards — returns all boards for the user (no nested data, for speed)
export const listBoards = async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { lists: true } },
        lists: {
          select: {
            _count: { select: { cards: true } },
          },
        },
      },
    });

    // Shape the response to match what the frontend expects:
    // { id, title, lists: [{ _count: { cards } }] }
    const shaped = boards.map((b) => ({
      id: b.id,
      title: b.title,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      lists: b.lists.map((l) => ({ _count: l._count })),
    }));

    res.json({ boards: shaped });
  } catch (err) {
    console.error("listBoards error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/boards/:id — full board with lists + cards
export const getBoard = async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: req.params.id },
      include: {
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    // Shape to match the frontend's data model
    const shaped = {
      id: board.id,
      title: board.title,
      lists: board.lists.map((l) => ({
        id: l.id,
        title: l.title,
        cards: l.cards.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          priority: c.priority,
          dueDate: c.dueDate ? c.dueDate.toISOString().slice(0, 10) : "",
          labels: c.labels,
          assignee: c.assignee,
          comments: c.comments,
        })),
      })),
    };

    res.json({ board: shaped });
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
          create: DEFAULT_LISTS.map((t, i) => ({
            title: t,
            position: i,
          })),
        },
      },
      include: {
        lists: { orderBy: { position: "asc" } },
      },
    });

    res.status(201).json({
      board: {
        id: board.id,
        title: board.title,
        lists: board.lists.map((l) => ({
          id: l.id,
          title: l.title,
          cards: [],
        })),
      },
    });
  } catch (err) {
    console.error("createBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH /api/boards/:id
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

// DELETE /api/boards/:id
export const deleteBoard = async (req, res) => {
  try {
    await prisma.board.delete({ where: { id: req.params.id } });
    res.json({ message: "Board deleted" });
  } catch (err) {
    console.error("deleteBoard error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};