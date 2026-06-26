import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJoYXJzaEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImhhcnNoIiwiaWF0IjoxNzgyMzc3NTc4fQ.cZiiw-VjwAZN6lWCrx8NYO053CPYsAovm8Z1o4KGFIU"
    }
});

socket.on("connect", () => {
    console.log("Connected");
});

socket.on("connect_error", (err) => {
    console.log(err.message);
});

socket.on("new_message", (message) =>{
    console.log(message);
})