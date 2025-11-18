import { io } from "socket.io-client";

export const socket = io("https://chatgpt-clone-eh05.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});
