
interface AuthUser {
    id: number;
    email: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user: AuthUser;
        }
    }
}


export {};