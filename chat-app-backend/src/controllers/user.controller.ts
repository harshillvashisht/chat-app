import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import { ApiError } from "../utils/ApiError";


export const userSearch = async (req: Request, res: Response, next: NextFunction ) => {

    try{
        const query = req.query.username as string;

        if(!query) {
            throw new ApiError(400, "username query parameter is required")
        }

        const username: string = query.replaceAll(" ", "");

        const result = await userService.userSearch(username , req.user.id);

        res.status(200).json({
            success: true,
            data: result
        })
    }
    catch(err){
        next(err)
    }

}