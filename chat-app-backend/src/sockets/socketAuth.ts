import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import "dotenv/config";
import { parseCookie } from "cookie";
import { AuthenticatedSocket } from "./socketTypes";

interface JwtPayload {
    id: number;
    email: string;
    username: string;
}

export const socketAuthMiddleware = (socket: Socket , next: Function) => {

    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
    return next(new Error("No cookies received"));
}

    const cookies = parseCookie(cookieHeader);

    const token = cookies.token;

    if (!token) {
        return next(new Error("Token not found"));
    }

    if(!process.env.JWT_SECRET){
        return next(new Error("Jwt secret is not defined "));
    }

    try{

        const payload  = jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload

        (socket as AuthenticatedSocket).user = {
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