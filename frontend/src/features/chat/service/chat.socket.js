import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
