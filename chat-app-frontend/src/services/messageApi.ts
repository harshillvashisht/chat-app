import { api } from "./axios";

export async function getMessages(chatId: number){
    return api.get(`messages/chat/${chatId}`)
}