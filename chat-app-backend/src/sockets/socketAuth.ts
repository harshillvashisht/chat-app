import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import "dotenv/config";

interface JwtPayload {
    id: number;
    email: string;
    username: string;
}

export const socketAuthMiddleware = (socket: Socket , next: Function) => {

    const token = socket.handshake.auth.token;

    if(!token){
        return next(new Error("token not received "));
    }

    if(!process.env.JWT_SECRET){
        return next(new Error("Jwt secret is not defined "));
    }

    try{

        const payload  = jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload

        (socket as any).user = {
            id: payload.id,
            email: payload.email,
            username: payload.username
        };

        next()

    }
    catch {
        next(new Error("invalid or expired token"));
    }
}