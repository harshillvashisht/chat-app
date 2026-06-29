import { api } from "./axios";

export async function login(email: string , password: string) {
    return api.post("/auth/login" , {
        email, 
        password
    })
}

export async function register(username: string , email: string, password: string){
    return api.post("auth/register" , {
        username,
        email,
        password
    })
}