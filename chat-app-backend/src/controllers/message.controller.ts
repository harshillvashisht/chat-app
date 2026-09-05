import { Request, Response, NextFunction } from "express";
import messageService from "../services/message.service";
import { getIO } from "../sockets/socket";

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    
    try{
        const chatId = +req.params.chatId;
        const userId = req.user.id;
        const content = req.body.content;
        const clientId = req.body.clientId;
        const attachments = req.body.attachments ?? []; 
        const encryptedVersion = req.body.encryptedVersion ?? null;
        

        const result = await messageService.sendmessage(chatId, userId, content, clientId, encryptedVersion, attachments );

        const io = getIO();

        io.to(`chat_${chatId}`).emit("new_message" , result);
        

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
        const after = req.query.after ? +req.query.after : undefined;
        
        const result = await messageService.getmessages(chatId, userId, after);

        

        res.status(200).json(result);
    }
    catch(err){
        next(err)
    }
}

