import { Server } from "socket.io";
import http from "http";
import { socketAuthMiddleware } from "./socketAuth";
import { handleConnection } from "./socket.controller";

let io: Server;

export const initializeSocket = (server: http.Server) => {
    io = new Server(server);

    io.use(socketAuthMiddleware)

    io.on("connection", handleConnection);

    return io;
};



export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }

    return io;
};