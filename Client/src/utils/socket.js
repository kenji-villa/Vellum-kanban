import { io } from "socket.io-client";

const SERVER_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
  /\/api\/?$/,
  "",
);

let socket = null;

// `getToken` is read on every (re)connect, so a refreshed login just works
export const connectSocket = (getToken) => {
  if (socket) return socket;
  socket = io(SERVER_URL, { auth: (cb) => cb({ token: getToken() }) });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => !!socket?.connected;
export const getSocketId = () => (socket?.connected ? socket.id : undefined);