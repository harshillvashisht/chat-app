import { api } from "./axios";

export async function getMessages(chatId: number){
    return api.get(`messages/chat/${chatId}`)
}

export async function sendMessage(chatId: number, content: string){
    return api.post(`messages/chat/${chatId}`, {
        content
    })
}