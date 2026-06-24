import { Request, Response, NextFunction } from "express";
import messageService from "../services/message.service";

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    
    try{
        const chatId = +req.params.chatId;
        const userId = req.user.id;
        const content = req.body.content;
        

        const result = await messageService.sendmessage(chatId, userId, content);

        

        res.status(200).json(result);
    }
    catch(err){
        next(err)
    }
}

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const chatId = +req.params.chatId;
        const userId = req.user.id;
        
        const result = await messageService.getmessages(chatId, userId);

        

        res.status(200).json(result);
    }
    catch(err){
        next(err)
    }
}

