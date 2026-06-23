import prisma from "../lib/prisma";

const userSearch = async (username: string , userId: number) => {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: username,
                mode: "insensitive"
            },
            NOT: {
                id: userId
            }
        },
        select: {
            id: true,
            username: true
        }
    });
}

export default { userSearch }