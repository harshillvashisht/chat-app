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

export async function getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
}

export async function updatePublicKey(publicKey: string) {
    await api.patch("/auth/me/publickey", { publicKey });
    
}