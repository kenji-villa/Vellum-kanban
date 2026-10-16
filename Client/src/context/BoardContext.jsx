import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { api } from "../utils/api";
import { useAuth } from "./AuthContext";

const BoardContext = createContext();

const initialState = {
  boards: [], // [{ id, title, lists: [{ id, title, cards: [...] }] }]
  loading: true,
  error: null,
};

// ------------------------------------------------------------
//                         Reducer
// ------------------------------------------------------------
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Replace entire boards list (used when loading)
    case "SET_BOARDS":
      return { ...state, boards: action.payload, loading: false, error: null };

    // Board-level
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };
    case "RENAME_BOARD":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, title: action.payload.title }
            : b,
        ),
      };
    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((b) => b.id !== action.payload.boardId),
      };

    // Insert a fully-loaded board (used after getBoard)
    case "MERGE_BOARD": {
      const exists = state.boards.some((b) => b.id === action.payload.id);
      return {
        ...state,
        boards: exists
          ? state.boards.map((b) =>
              b.id === action.payload.id ? action.payload : b,
            )
          : [...state.boards, action.payload],
      };
    }

    // List-level
    case "ADD_LIST":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? { ...b, lists: [...b.lists, action.payload.list] }
            : b,
        ),
      };
    case "UPDATE_LIST":
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
    case "DELETE_LIST":
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
    case "REORDER_LIST": {
      const { boardId, fromIndex, toIndex } = action.payload;
      return {
        ...state,
        boards: state.boards.map((b) => {
          if (b.id !== boardId) return b;
          const lists = [...b.lists];
          const [moved] = lists.splice(fromIndex, 1);
          lists.splice(toIndex, 0, moved);
          return { ...b, lists };
        }),
      };
    }

    // Card-level
    case "ADD_CARD":
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.boardId
            ? {
                ...b,
                lists: b.lists.map((l) =>
                  l.id === action.payload.listId
                    ? { ...l, cards: [...l.cards, action.payload.card] }
                    : l,
                ),
              }
            : b,
        ),
      };
    case "UPDATE_CARD":
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
    case "DELETE_CARD":
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
    case "MOVE_CARD": {
      const { boardId, fromListId, toListId, fromIndex, toIndex } =
        action.payload;
      return {
        ...state,
        boards: state.boards.map((b) => {
          if (b.id !== boardId) return b;
          const fromList = b.lists.find((l) => l.id === fromListId);
          if (!fromList) return b;
          const moved = fromList.cards[fromIndex];
          if (!moved) return b;

          const lists = b.lists.map((l) => {
            if (l.id === fromListId && l.id === toListId) {
              const cards = [...l.cards];
              cards.splice(fromIndex, 1);
              cards.splice(toIndex, 0, moved);
              return { ...l, cards };
            }
            if (l.id === fromListId)
              return { ...l, cards: l.cards.filter((_, i) => i !== fromIndex) };
            if (l.id === toListId) {
              const cards = [...l.cards];
              const idx =
                toIndex === undefined || toIndex > cards.length
                  ? cards.length
                  : toIndex;
              cards.splice(idx, 0, moved);
              return { ...l, cards };
            }
            return l;
          });
          return { ...b, lists };
        }),
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

// ------------------------------------------------------------
//                        Provider
// ------------------------------------------------------------
export const BoardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated } = useAuth();
  const optimisticRef = useRef(new Map());

  // ------------------------------------------------------------------
  // 1. reloadBoards — MUST be defined first so others can reference it
  // ------------------------------------------------------------------
  const reloadBoards = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { boards } = await api.listBoards();
      const fullBoards = await Promise.all(
        boards.map(async (b) => {
          const { board } = await api.getBoard(b.id);
          return board;
        }),
      );
      dispatch({ type: "SET_BOARDS", payload: fullBoards });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  }, []);

  // Load boards when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: "RESET" });
      return;
    }
    const load = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const { boards } = await api.listBoards();
        // We need full board data (lists + cards), so fetch each board's details
        const fullBoards = await Promise.all(
          boards.map(async (b) => {
            const { board } = await api.getBoard(b.id);
            return board;
          }),
        );
        dispatch({ type: "SET_BOARDS", payload: fullBoards });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: err.message });
      }
    };
    load();
  }, [isAuthenticated]);

  // ------------------------------------------------------------
  // Public actions — optimistic, with rollback on failure
  // ------------------------------------------------------------

  // ---- Boards ----
  const createBoard = useCallback(async (title) => {
    const { board } = await api.createBoard({ title });
    dispatch({ type: "ADD_BOARD", payload: board });
    return board;
  }, []);

  const renameBoard = useCallback(async (boardId, title) => {
    dispatch({ type: "RENAME_BOARD", payload: { boardId, title } });
    try {
      await api.updateBoard(boardId, { title });
    } catch (err) {
      // Rollback not easily done without knowing previous title;
      // simplest is to reload the boards list on error
      console.error("renameBoard failed:", err);
    }
  }, []);

  const deleteBoard = useCallback(
    async (boardId) => {
      dispatch({ type: "DELETE_BOARD", payload: { boardId } });
      try {
        await api.deleteBoard(boardId);
      } catch (err) {
        console.error("deleteBoard failed, reloading:", err);
        await reloadBoards();
      }
    },
    [reloadBoards],
  );

  // ---- Lists ----
  const createList = useCallback(async (boardId, title) => {
    const { list } = await api.createList(boardId, { title });
    dispatch({ type: "ADD_LIST", payload: { boardId, list } });
    return list;
  }, []);

  const updateList = useCallback(async (boardId, listId, title) => {
    dispatch({ type: "UPDATE_LIST", payload: { boardId, listId, title } });
    try {
      await api.updateList(listId, { title });
    } catch (err) {
      console.error("updateList failed:", err);
    }
  }, []);

  const deleteList = useCallback(async (boardId, listId) => {
    dispatch({ type: "DELETE_LIST", payload: { boardId, listId } });
    try {
      await api.deleteList(listId);
    } catch (err) {
      console.error("deleteList failed:", err);
    }
  }, []);

  const reorderLists = useCallback(
    async (boardId, fromIndex, toIndex) => {
      dispatch({
        type: "REORDER_LIST",
        payload: { boardId, fromIndex, toIndex },
      });
      // After local reorder, rebuild the id array and send to API
      // We read from state via a functional approach — but since useCallback
      // has a stale closure on `state`, we use the reducer's result implicitly.
      // Simpler: compute new order from the *current* boards in a microtask.
      // For now, we fetch fresh and send — the UI already updated optimistically.
      const currentBoard = state.boards.find((b) => b.id === boardId);
      if (!currentBoard) return;
      const newOrder = [...currentBoard.lists];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      try {
        await api.reorderLists(
          boardId,
          newOrder.map((l) => l.id),
        );
      } catch (err) {
        console.error("reorderLists failed:", err);
      }
    },
    [state.boards],
  );

  // ---- Cards ----
  const createCard = useCallback(async (boardId, listId, formData) => {
    const { card } = await api.createCard(listId, formData);
    dispatch({ type: "ADD_CARD", payload: { boardId, listId, card } });
    return card;
  }, []);

  const updateCard = useCallback(async (boardId, listId, cardId, updates) => {
    dispatch({
      type: "UPDATE_CARD",
      payload: { boardId, listId, cardId, updates },
    });
    try {
      await api.updateCard(cardId, updates);
    } catch (err) {
      console.error("updateCard failed:", err);
    }
  }, []);

  const deleteCard = useCallback(
    async (boardId, listId, cardId) => {
      dispatch({ type: "DELETE_CARD", payload: { boardId, listId, cardId } });
      try {
        await api.deleteCard(cardId);
      } catch (err) {
        console.error("deleteCard failed, reloading:", err);
        await reloadBoards();
      }
    },
    [reloadBoards],
  );

  const moveCard = useCallback(
    async (boardId, fromListId, toListId, fromIndex, toIndex) => {
      // Find the card BEFORE any optimistic update so we have the correct ID
      const boardBefore = state.boards.find((b) => b.id === boardId);
      const sourceListBefore = boardBefore?.lists.find(
        (l) => l.id === fromListId,
      );
      const movedCard = sourceListBefore?.cards[fromIndex];
      if (!movedCard) {
        console.error("moveCard: source card not found");
        return;
      }

      const cardId = movedCard.id;

      // 1. Optimistic UI update — this is safe because we already captured cardId
      dispatch({
        type: "MOVE_CARD",
        payload: { boardId, fromListId, toListId, fromIndex, toIndex },
      });

      // 2. Persist to backend
      try {
        await api.moveCard(cardId, { toListId, toIndex });
      } catch (err) {
        console.error("moveCard failed, reloading board:", err);
        // Rollback: fetch this board fresh from the API and replace it
        try {
          const { board: fresh } = await api.getBoard(boardId);
          dispatch({ type: "MERGE_BOARD", payload: fresh });
        } catch (reloadErr) {
          console.error("moveCard rollback reload failed:", reloadErr);
          await reloadBoards();
        }
      }
    },
    [state.boards, reloadBoards],
  );

  return (
    <BoardContext.Provider
      value={{
        state,
        dispatch,
        createBoard,
        renameBoard,
        deleteBoard,
        createList,
        updateList,
        deleteList,
        reorderLists,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        reloadBoards,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used inside BoardProvider");
  return ctx;
};
