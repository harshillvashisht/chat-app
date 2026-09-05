import { api } from "./axios";

export async function getMessages(chatId: number, after?: number){
    return api.get(`messages/chat/${chatId}`, {
        params: after ? { after } : {},
    })
}

export async function sendMessage(chatId: number, content: string | null, clientMessageId: string, attachments?: { objectKey: string; mimeType: string; fileName: string; fileSize: number }[]) {
    return api.post(`messages/chat/${chatId}`, {
        content,
        clientId: clientMessageId,
        attachments,
        encryptedVersion: content ? 1 : null, // Set encryptedVersion to 1 if content is provided, otherwise null
    });
}