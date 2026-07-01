import { api } from "./axios";

export async function getRequests() {
    return api.get("/friendRequest/incoming")
}

export async function acceptRequest(chatId: number){
    return api.post(`/friendRequest/${chatId}/accept`)
}

export async function declineRequest(chatId: number){
    return api.post(`/friendRequest/${chatId}/reject`)
}