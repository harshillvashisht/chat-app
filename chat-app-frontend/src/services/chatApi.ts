import { api } from "./axios";

export async function getChats() {
    return api.get("/chat")
}