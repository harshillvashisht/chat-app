import { Request, Response, NextFunction } from "express";
import friendRequestService from "../services/friendRequest.service";

export const sendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId: number = req.user.id;
        const senderUsername: string = req.body.username;

        const result = await friendRequestService.sendRequest(userId , senderUsername);

        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
}

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user.id;

        const result = await friendRequestService.getRequests(userId);

        res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}

export const acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const friendRequestId = +req.params.id;
        const userId = req.user.id

        const result = await friendRequestService.acceptRequest(friendRequestId, userId);

        res.status(200).json(result);
    }
    catch(err){
        next(err);
    }

}

export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const friendRequestId = +req.params.id;
        const userId = req.user.id

        await friendRequestService.rejectRequest(friendRequestId,userId);

        res.status(200).json({
            success: true,
            message: "request rejected successfully"
        })
    }
    catch(err){
        next(err)
    }
}