import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialData } from "../data/initialData";

const BoardContext = createContext();

const STORAGE_KEY = "vellum_state_v1";

// ---------- Utilities ----------
const generateId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ---------- Reducer ----------
const boardReducer = (state, action) => {
  switch (action.type) {
    // -------- BOARDS --------
    case "ADD_BOARD": {
      const newBoard = {
        id: generateId("board"),
        title: action.payload.title || "Untitled Board",
        lists: [],
      };
      return { ...state, boards: [...state.boards, newBoard] };
    }

    case "RENAME_BOARD": {
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, title: action.payload.title }
            : b,
        ),
      };
    }

    case "DELETE_BOARD": {
      return {
        ...state,
        boards: state.boards.filter((b) => b.id !== action.payload.boardId),
      };
    }

    // -------- LISTS --------
    case "ADD_LIST": {
      const newList = {
        id: generateId("list"),
        title: action.payload.title || "New List",
        cards: [],
      };
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, lists: [...b.lists, newList] }
            : b,
        ),
      };
    }

    case "UPDATE_LIST": {
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === action.payload.listId
                    ? { ...l, title: action.payload.title }
                    : l,
                ),
              }
            : b,
        ),
      };
    }

    case "DELETE_LIST": {
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.filter((l) => l.id !== action.payload.listId),
              }
            : b,
        ),
      };
    }

    // -------- CARDS --------
    case "ADD_CARD": {
      const newCard = {
        id: generateId("card"),
        title: action.payload.title || "New Task",
        description: action.payload.description || "",
        priority: action.payload.priority || "medium",
        dueDate: action.payload.dueDate || "",
        labels: action.payload.labels || [],
        assignee: action.payload.assignee || "",
        comments: 0,
      };
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === action.payload.listId
                    ? { ...l, cards: [...l.cards, newCard] }
                    : l,
                ),
              }
            : b,
        ),
      };
    }

    case "UPDATE_CARD": {
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === action.payload.listId
                    ? {
                        ...l,
                        cards: l.cards.map((c) =>
                          c.id === action.payload.cardId
                            ? { ...c, ...action.payload.updates }
                            : c,
                        ),
                      }
                    : l,
                ),
              }
            : b,
        ),
      };
    }

    case "DELETE_CARD": {
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === action.payload.listId
                    ? {
                        ...l,
                        cards: l.cards.filter(
                          (c) => c.id !== action.payload.cardId,
                        ),
                      }
                    : l,
                ),
              }
            : b,
        ),
      };
    }

    // -------- DRAG & DROP --------
    // Reorder cards within the SAME list
    case "REORDER_CARD": {
      const { boardId, listId, fromIndex, toIndex } = action.payload;
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === boardId
            ? {
                ...b,
                lists: b.lists.map((l) => {
                  if (l.id !== listId) return l;
                  const newCards = [...l.cards];
                  const [moved] = newCards.splice(fromIndex, 1);
                  newCards.splice(toIndex, 0, moved);
                  return { ...l, cards: newCards };
                }),
              }
            : b,
        ),
      };
    }

    // Move a card BETWEEN lists (or reorder within the same list via index)
    case "MOVE_CARD": {
      const { boardId, fromListId, toListId, fromIndex, toIndex } =
        action.payload;
      return {
        ...state,
        boards: state.boards.map((b) => {
          if (b.id !== boardId) return b;

          // Find the card being moved
          const fromList = b.lists.find((l) => l.id === fromListId);
          if (!fromList) return b;
          const movedCard = fromList.cards[fromIndex];
          if (!movedCard) return b;

          // Build new lists
          const newLists = b.lists.map((l) => {
            if (l.id === fromListId && l.id === toListId) {
              // Same list: reorder
              const newCards = [...l.cards];
              newCards.splice(fromIndex, 1);
              newCards.splice(toIndex, 0, movedCard);
              return { ...l, cards: newCards };
            }
            if (l.id === fromListId) {
              // Remove from source
              return {
                ...l,
                cards: l.cards.filter((_, i) => i !== fromIndex),
              };
            }
            if (l.id === toListId) {
              // Insert into destination
              const newCards = [...l.cards];
              const safeIndex =
                toIndex === undefined || toIndex > newCards.length
                  ? newCards.length
                  : toIndex;
              newCards.splice(safeIndex, 0, movedCard);
              return { ...l, cards: newCards };
            }
            return l;
          });

          return { ...b, lists: newLists };
        }),
      };
    }

    // -------- REORDER LIST --------
    case "REORDER_LIST": {
      const { boardId, fromIndex, toIndex } = action.payload;
      return {
        ...state,
        boards: state.boards.map((b) => {
          if (b.id !== boardId) return b;
          const newLists = [...b.lists];
          const [moved] = newLists.splice(fromIndex, 1);
          newLists.splice(toIndex, 0, moved);
          return { ...b, lists: newLists };
        }),
      };
    }
    case "REPLACE_STATE": {
      return {
        ...state,
        boards: action.payload.boards || [],
      };
    }
  }
};

// ---------- Provider ----------
export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialData, (init) => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

// ---------- Hook ----------
export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard must be used within BoardProvider");
  return context;
};
