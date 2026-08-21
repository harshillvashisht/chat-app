import prisma from "../lib/prisma"
import { AttachmentInput } from "../types/attachmenttype";
import { ApiError } from "../utils/ApiError";
import { Prisma } from "@prisma/client";
import { buildMessagePreview , withAttachmentUrls } from "../utils/buildmessagepreview";

const sendmessage = async (chatId: number , userId: number, content: string, clientId: string, attachments: AttachmentInput[] = []) => {

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

    if (!content?.trim() && attachments.length === 0) {
        throw new ApiError(400, "Message must have content or at least one attachment")
    }

    try {
        return await prisma.$transaction(async (tx) => {

            const message = await tx.message.create({
                data: {
                    content: content?.trim() ? content : null,
                    senderId: userId,
                    chatId: chatId,
                    clientMessageId: clientId,
                    attachments: {
                        create: attachments.map(a => ({
                            objectKey: a.objectKey,
                            type: a.mimeType.startsWith("image/") ? "IMAGE"
                                : a.mimeType.startsWith("audio/") ? "AUDIO"
                                : "DOCUMENT",
                            mimeType: a.mimeType,
                            fileName: a.fileName,
                            fileSize: a.fileSize,
                            duration: a.duration ?? null,
                        }))
                    }
                },
                include: { attachments: true } 
            })

                const previewMessage = buildMessagePreview(message.content, attachments);

                await tx.chat.update({
                    where:{
                        id: chatId
                    },
                    data:{
                        lastMessage: previewMessage,
                        lastMessageAt: message.createdAt
                    }
                })

                return withAttachmentUrls({ ...message, lastMessagePreview: previewMessage })
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const existing = await prisma.message.findUnique({
                where: { clientMessageId: clientId },
                include: { attachments: true }   
            });

            if (existing) {
                return withAttachmentUrls(existing);
            }

            throw new ApiError(500, "Internal server error");
        }
        throw error; 
    }
}

const getmessages = async (chatId: number, userId: number, after?: number) =>{

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
            chatId: chatId,
            ...(after && { id: { gt: after } })
        },
        orderBy:{
            id: "asc"
        },
        include: { attachments: true }
    })

    return result.map(withAttachmentUrls)

}



export default {sendmessage, getmessages}