import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useBoard } from "../context/BoardContext";
import { useNotifications } from "../context/NotificationContext";
import { getToken } from "../utils/api";
import { connectSocket, disconnectSocket } from "../utils/socket";

const RealtimeSync = () => {
  const { isAuthenticated } = useAuth();
  const { refreshBoard, refreshBoards } = useBoard();
  const { refresh: refreshNotifications, bumpTeam } = useNotifications();
  const connectedBefore = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      connectedBefore.current = false;
      return;
    }

    const socket = connectSocket(getToken);
    const logAll = (event, ...args) => console.log("[socket]", event, ...args);
    socket.onAny(logAll);

    const onBoardChanged = ({ boardId, cardId }) => {
      refreshBoard(boardId);
      // Lets an open task feed or board activity dialog update too
      window.dispatchEvent(
        new CustomEvent("vellum:board-changed", {
          detail: { boardId, cardId },
        }),
      );
    };
    const onBoardsChanged = () => {
      refreshBoards();
      bumpTeam();
    };
    const onNotification = () => refreshNotifications();
    const onConnect = () => {
      // After a reconnect, catch up on anything missed while offline
      if (connectedBefore.current) {
        refreshBoards();
        refreshNotifications();
      }
      connectedBefore.current = true;
    };

    socket.on("board:changed", onBoardChanged);
    socket.on("boards:changed", onBoardsChanged);
    socket.on("notifications:new", onNotification);
    socket.on("connect", onConnect);

    return () => {
      socket.off("board:changed", onBoardChanged);
      socket.off("boards:changed", onBoardsChanged);
      socket.off("notifications:new", onNotification);
      socket.off("connect", onConnect);
      socket.offAny(logAll);
    };
  }, [
    isAuthenticated,
    refreshBoard,
    refreshBoards,
    refreshNotifications,
    bumpTeam,
  ]);

  return null;
};

export default RealtimeSync;
