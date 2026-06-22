import express from "express";
import authRoutes from "./routes/auth.routes";
import { errormiddleware } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);


app.use(errormiddleware)

export default app;