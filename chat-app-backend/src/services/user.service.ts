import prisma from "../lib/prisma";

const userSearch = async (username: string , userId: number) => {
   const users = await prisma.user.findMany({
    where: {
        username: {
            contains: username,
            mode: "insensitive",
        },
        NOT: {
            id: userId,
        },
    },
    select: {
        id: true,
        username: true,

        sentFriendRequests: {
            where: {
                receiverId: userId,
            },
            select: {
                status: true,
            },
        },

        receivedFriendRequests: {
            where: {
                senderId: userId,
            },
            select: {
                status: true,
            },
        },
    },
});

    return users.map((user) => {
    let relationship = "NONE";

    if (user.sentFriendRequests.length > 0) {
        const status = user.sentFriendRequests[0].status;

        if (status === "PENDING") relationship = "PENDING_RECEIVED";
        else if (status === "ACCEPTED") relationship = "FRIENDS";
    }

    if (user.receivedFriendRequests.length > 0) {
        const status = user.receivedFriendRequests[0].status;

        if (status === "PENDING") relationship = "PENDING_SENT";
        else if (status === "ACCEPTED") relationship = "FRIENDS";
    }

    return {
        id: user.id,
        username: user.username,
        relationship,
    };
});
}

export default { userSearch }