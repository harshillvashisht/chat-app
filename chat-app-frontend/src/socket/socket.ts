import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
    autoConnect: false,
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
});

socket.on("connect_error", (err) => {
    console.log("❌ Socket error:", err.message);
});