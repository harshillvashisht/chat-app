import { Request, Response, NextFunction } from "express";
import chatService from "../services/chat.service";


export const getChats = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId: number = req.user.id;

        const result = await chatService.getchats(userId);

        res.status(200).json(result)

    }
    catch(err){
        next(err)
    }


}