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

    // -------- REORDER (used in Phase 4) --------
    case "REORDER_CARDS":
    case "MOVE_CARD":
      return state; // placeholder for Phase 4

    case "RESET_STATE":
      return initialData;

    default:
      return state;
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
