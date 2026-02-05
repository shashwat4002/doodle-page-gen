import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_SOCKET_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });
  }
  return socket;
};

