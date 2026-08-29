import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { RegisterUser , LoginUser } from "../validators/auth.validator";


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const validatedInput = RegisterUser.parse(req.body)
        const { username , email, password } = validatedInput;

        const result = await authService.createUser(username , email, password);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error: any) {
       next(error)
        
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
        const validatedInput = LoginUser.parse(req.body);
        const { email , password } = validatedInput;

        
        const result = await authService.validateUser(email, password);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(200).json({
            success: true,
            message: "user successfully logged in",
        })
    }
    catch(error: any){
        next(error)
    }
}

export const getuser = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const userid = req.user.id;

        const response = await authService.getuser(userid);

        if (!response) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(response);

    } catch(err){
        next(err);
    }
}

export const insertPublicKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { publicKey } = req.body;

        if (!publicKey) {
            throw new ApiError(400, "Public key is required");
        }

        await authService.insertPublicKey(userId, publicKey);

        res.status(200).json({
            success: true,
            message: "Public key inserted successfully",
        });
    } catch (error: any) {
        next(error);
    }
}