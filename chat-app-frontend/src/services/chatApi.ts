import { api } from "./axios";

export async function getChats() {
    return api.get("/chat")
}

export async function markChatRead(chatId: number) {
    return api.post(`/chat/${chatId}/read`);
}