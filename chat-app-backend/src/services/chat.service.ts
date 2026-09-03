import prisma from "../lib/prisma"


const getchats = async (userId: number) =>{

    const chats = await prisma.chat.findMany({
        where:{
            OR: [
            {participant1Id: userId},
            {participant2Id: userId}
            ]
        },
        include: {
            participant1: {
                select:{
                    id: true,
                    username: true
                }
            },
            participant2: {
                select: {
                    id: true,
                    username: true
                }
            }
        },
        orderBy: {
            lastMessageAt: "desc"
        }
    });

    const result = chats.map(chat => {
        const otheruser = chat.participant1Id == userId ? chat.participant2 : chat.participant1;
        const otherUserLastReadMessageId = chat.participant1Id == userId
            ? chat.participant2LastReadMessageId
            : chat.participant1LastReadMessageId;
        return {
            id: chat.id,
            otherUser: {
                id: otheruser.id,
                username: otheruser.username
            },
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            otherUserLastReadMessageId: otherUserLastReadMessageId
        };

    })

    return result

    
}

const markChatAsRead = async (userId: number, chatId: number) => {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat) {
        throw new Error("Chat not found");
    }

    if (chat.participant1Id !== userId && chat.participant2Id !== userId) {
        throw new Error("User is not a participant of this chat");
    }

    const latestMessage = await prisma.message.findFirst({
        where: { chatId },
        orderBy: { id: "desc" },
        select: { id: true }
    });

    if (!latestMessage) {
        return null;
    }

    const field = chat.participant1Id === userId
        ? "participant1LastReadMessageId"
        : "participant2LastReadMessageId";

    await prisma.chat.update({
        where: { id: chatId },
        data: { [field]: latestMessage.id }
    });

    return latestMessage.id;
};

const getChatPublicKey = async (userId: number, chatId: number) => {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            participant1: {
                select: {
                    id: true,
                    publicKey: true
                }
            },
            participant2: {
                select: {
                    id: true,
                    publicKey: true
                }
            }
        }
    });

    if (!chat) return { status: "not_found" };

    if (chat.participant1Id !== userId && chat.participant2Id !== userId) return { status: "forbidden" };

    const publicKey = chat.participant1Id === userId ? chat.participant2.publicKey : chat.participant1.publicKey;

    return { status: "ok", publicKey }; 
};

export default { getchats, markChatAsRead, getChatPublicKey }