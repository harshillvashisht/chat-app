import * as z from "zod";

export const RegisterUser = z.object({
    username : z.string().min(3),
    email : z.email(),
    password: z.string().min(8)
});

export const LoginUser = z.object({
    email: z.email(),
    password: z.string().min(8)
});