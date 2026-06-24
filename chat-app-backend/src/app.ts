import express from "express";
import authRoutes from "./routes/auth.routes";
import { errormiddleware } from "./middleware/error.middleware";
import chatRoutes from "./routes/chat.routes";
import { authmiddleware } from "./middleware/auth.middleware";
import userRoutes from "./routes/user.routes";
import friendRequestRoutes from "./routes/friendRequest.routes";


const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat" , authmiddleware, chatRoutes );
app.use("/api/v1/users", authmiddleware,  userRoutes);
app.use("/api/v1/friendRequest", authmiddleware, friendRequestRoutes);


app.use(errormiddleware)

export default app;