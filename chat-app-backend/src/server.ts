import app from "./app";
import http from "http";
import { initializeSocket } from "./sockets/socket";

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})