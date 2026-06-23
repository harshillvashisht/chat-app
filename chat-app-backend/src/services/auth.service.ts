import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import "dotenv/config"

const createUser = async (username: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new ApiError(409 ,"User already exists");
        
    }

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });
    return { id: user.id , email: user.email , username: user.username };
    
};

const validateUser = async (email: string , password: string) => {
    const User = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if(!User) {
        throw new ApiError(401, "Invalid credentials");
    }

    const passwordCheck = await bcrypt.compare(password , User.password);

    if(!passwordCheck) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!process.env.JWT_SECRET) {
        throw new ApiError(500, "JWT_SECRET is not defined in environment variables");
    }

    const token : string = jwt.sign({id: User.id , email: User.email , username: User.username }, process.env.JWT_SECRET )

    return { token }
}

export default { createUser , validateUser };