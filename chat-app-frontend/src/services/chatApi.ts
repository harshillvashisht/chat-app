import { api } from "./axios";

export async function getChats() {
    return api.get("/chat")
}

export async function markChatRead(chatId: number) {
    return api.post(`/chat/${chatId}/read`);
}

export async function getChatPublicKey(chatId: number): Promise<{ publicKey: string | null }> {
    const response = await api.get(`/chat/${chatId}/public-key`);
    return response.data;
}