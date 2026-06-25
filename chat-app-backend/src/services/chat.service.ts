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

        return {
            id: chat.id,
            otherUser: {
                id: otheruser.id,
                username: otheruser.username
            },
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt
        };

    })

    return result

    
}

export default { getchats }