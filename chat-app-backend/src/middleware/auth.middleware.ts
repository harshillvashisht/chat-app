import { Request, Response,  NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import 'dotenv/config';

interface AuthUser {
    id: number;
    email: string;
    username: string;
}


export const authmiddleware = (req: Request,res: Response,next: NextFunction) => {
    
    const authHeader= req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new ApiError(401, "Token not received")
    }

    const token: string = authHeader.split(' ')[1];

    if(!process.env.JWT_SECRET){
        throw new ApiError(500 , "JWT_SECRET is not defined in environment variables")
    }

    try{

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        
        if (typeof decoded === "string") {
            throw new ApiError(401, "Invalid token");
        }
        
        req.user = decoded as AuthUser;
        
        next();
}
catch{
    throw new ApiError(401, "invalid or expired token")
}

}