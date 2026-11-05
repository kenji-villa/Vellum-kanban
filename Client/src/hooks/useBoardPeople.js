import { useMemo } from "react";
import { useBoard } from "../context/BoardContext";
import { useAuth } from "../context/AuthContext";

export const useBoardPeople = (boardId) => {
  const { state } = useBoard();
  const { user } = useAuth();

  return useMemo(() => {
    const board = state.boards.find((b) => b.id === boardId);
    if (!board) return [];
    // A board you just created only has the owner's id
    const owner =
      board.owner?.name || board.owner?.id !== user?.id
        ? board.owner
        : { id: user.id, name: user.name, title: user.title, avatarUrl: user.avatarUrl };
    return [owner, ...(board.members || [])].filter((p) => p?.id);
  }, [state.boards, boardId, user]);
};