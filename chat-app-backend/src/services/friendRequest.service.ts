
import prisma from "../lib/prisma"
import { ApiError } from "../utils/ApiError"


const sendRequest = async (userId: number, username: string) => {

    const receiver = await prisma.user.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    })

    if(!receiver){
        throw new ApiError(401, "username is incorrect or user doesn't exist")
    }

    if(receiver.id == userId){
        throw new ApiError(400 , "cannot send request to yourself")
    }


    const existingRequest = await prisma.friendRequest.findFirst({
        where: {
            OR: [
                {
                    senderId: userId,
                    receiverId: receiver.id
                },
                {
                    senderId: receiver.id,
                    receiverId: userId
                }
            ]
        }
    });

    if(existingRequest?.status == "ACCEPTED"){
        throw new ApiError(409 , "A friend request already exist and is Accepted");
    }

    if(existingRequest?.status == "PENDING"){
        throw new ApiError(409, "A friend request already exist and is Pending")
    }

    if(existingRequest?.status == "REJECTED"){
        return await prisma.friendRequest.update({
            where: {
                id: existingRequest.id
            },
            data: {
                status: "PENDING"
            }
        })
    }

    const sentRequest = await prisma.friendRequest.create({
        data: {
            senderId: userId,
            receiverId: receiver.id
        }
    })

    return sentRequest


}

const getRequests = async (userId: number) => {

    const getRequests = await prisma.friendRequest.findMany({
        where: {
            receiverId: userId,
            status: "PENDING"
        },
        select:{
            id: true,
            sender: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
        
    })

    return getRequests
}

const acceptRequest = async (friendRequestId: number, userId: number) =>{

    if (isNaN(friendRequestId)) {
        throw new ApiError(400, "Invalid friend request id");
    }

    const request = await prisma.friendRequest.findUnique({
        where: {
            id: friendRequestId
        }
    })

    if(!request){
        throw new ApiError(404 , "Request not found")
    }

    if(request.receiverId != userId){
        throw new ApiError(403, "You are not authorised to accept this request")
    }

    if(request.status != "PENDING"){
        throw new ApiError(400 , "Request is no longer Pending")
    }

    const participant1Id = Math.min(request.senderId, request.receiverId);
    const participant2Id = Math.max(request.senderId, request.receiverId);

    const [, createChat] = await prisma.$transaction([
        prisma.friendRequest.update({
            where: {
                id: friendRequestId
            },
            data: {
                status: "ACCEPTED"
            }
        }),
        prisma.chat.create({
            data:{
                participant1Id: participant1Id,
                participant2Id: participant2Id
            }
        })
    ]);

    return createChat
}

const rejectRequest = async (friendRequestId: number, userId: number) => {

    if (isNaN(friendRequestId)) {
        throw new ApiError(400, "Invalid friend request id");
    }

    const request = await prisma.friendRequest.findUnique({
        where: {
            id: friendRequestId
        }
    })

    if(!request){
        throw new ApiError(404 , "Request not found")
    }

    if(request.receiverId != userId){
        throw new ApiError(403, "You are not authorised to reject this request")
    }

    if(request.status != "PENDING"){
        throw new ApiError(400 , "Request is no longer Pending")
    }

    await prisma.friendRequest.update({
        where: {
            id: friendRequestId
        },
        data: {
            status: "REJECTED"
        }
    })
}

export default { sendRequest, getRequests, acceptRequest, rejectRequest }