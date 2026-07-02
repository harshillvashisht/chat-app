import { Socket } from "socket.io"
import prisma from "../lib/prisma"
import { AuthenticatedSocket } from "./socketTypes";

export const joinUserRooms = async (socket: AuthenticatedSocket) => {

    const chats = await prisma.chat.findMany({
        where: {
            OR: [
                {participant1Id: socket.user.id},
                {participant2Id: socket.user.id}
            ]
        }
    });


    for( const chat of chats ){
        await socket.join(`chat_${chat.id}`);

    }
}