export const socket = io("https://chatgpt-clone-eh05.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"], // WS first → fallback polling
  reconnection: true,
  reconnectionAttempts: Infinity,
});
