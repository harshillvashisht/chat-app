import prisma from "../lib/prisma"
import { ApiError } from "../utils/ApiError";
import { Prisma } from "@prisma/client";

const sendmessage = async (chatId: number , userId: number, content: string, clientId: string) => {

    if (isNaN(chatId)) {
        throw new ApiError(400, "Invalid chat id");
    }

    const chat = await prisma.chat.findUnique({
        where:{
            id: chatId
        },
        select:{
            participant1Id: true,
            participant2Id: true
        }
    })

    if(!chat){
        throw new ApiError(404, "Chat id not found")
    }

    if(chat.participant1Id != userId && userId != chat.participant2Id){
        throw new ApiError(403, "you are not authorised to see this chat")
    }

    if(!content.trim()){
        throw new ApiError(400 , "content is not valid")
    }

    try {
        return await prisma.$transaction(async (tx) => {

            const message = await tx.message.create({
                    data: {
                        content: content,
                        senderId: userId,
                        chatId: chatId,
                        clientMessageId: clientId
                    }
                })

                await tx.chat.update({
                    where:{
                        id: chatId
                    },
                    data:{
                        lastMessage: message.content,
                        lastMessageAt: message.createdAt
                    }
                })

                return message
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const exisiting = await prisma.message.findUnique({
                where: {
                    clientMessageId: clientId
                }
            });

            if(exisiting){
                return exisiting
            }

            throw new ApiError(500, "Internal server error");
        } 
    }
}

const getmessages = async (chatId: number, userId: number) =>{

    if (isNaN(chatId)) {
        throw new ApiError(400, "Invalid chat id");
    }

    const chat = await prisma.chat.findUnique({
        where:{
            id: chatId
        },
        select:{
            participant1Id: true,
            participant2Id: true
        }
    })

    if(!chat){
        throw new ApiError(404, "Chat id not found")
    }

    if(chat.participant1Id != userId && userId != chat.participant2Id){
        throw new ApiError(403, "you are not authorised to see this chat")
    }

    const result = await prisma.message.findMany({
        where:{
            chatId: chatId
        },
        orderBy:{
            createdAt: "asc"
        }
    })

    return result

}



export default {sendmessage, getmessages}