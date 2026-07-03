import { api } from "./axios";

export async function searchUsers(username: string) {
    return api.get("/users/search", {
        params: {
            username: username
        }
    } )
}