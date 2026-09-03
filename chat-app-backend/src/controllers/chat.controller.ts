import { Request, Response, NextFunction } from "express";
import chatService from "../services/chat.service";
import { getIO } from "../sockets/socket";


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

export const markChatAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = req.user.id;
        const chatId: number = +req.params.chatId;

        const lastReadMessageId = await chatService.markChatAsRead(userId, chatId);

        if (lastReadMessageId === null) {
            res.status(200).json({ message: "No messages to mark as read" });
            return;
        }

        const io = getIO();
        io.to(`chat_${chatId}`).emit("chat_read", { chatId, userId, lastReadMessageId });

        res.status(200).json({ message: "Chat marked as read successfully", lastReadMessageId });
    } catch (err) {
        next(err);
    }
};

export const getChatPublicKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = req.user.id;
        const chatId: number = +req.params.chatId;

        const publicKey = await chatService.getChatPublicKey(userId, chatId);
        if (publicKey.status === "not_found") {
            res.status(404).json({ message: "Chat not found" });
            return;
        }
        if (publicKey.status === "forbidden") {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        res.status(200).json({ publicKey: publicKey.publicKey });
    } catch (err) {
        next(err);
    }
};