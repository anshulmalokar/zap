import { Request,Response } from "express"
import { LoginData, loginValidationSchema } from "../types";
import prisma from "../db";
import bcrypt from "bcrypt";
import { TokenManager } from "../utils/TokenManager";

export const signup = async (req: Request,res: Response) => {
    try{
        const body:LoginData = req.body;
        const {success} = loginValidationSchema.safeParse({
            email: body.email,
            password: body.password,
            username: body.username
        })
        if(!success){
            return res.status(404).json({
                message: "Please enter the valid inputs for siggning up"
            });
        }
        const user_exists = await prisma.user.findFirst({
            where:{
                OR:[
                    {
                        email: body.email
                    },
                    {
                        name: body.username
                    }
                ]
            },
        });
        if(user_exists){
            return res.status(404).json({
                message: "The User Already Exists"
            });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        await prisma.user.create({
            data:{
                name: body.username,
                email: body.email,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            message: "User Created Successfully",
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const signin = async (req: Request,res: Response) => {
    try{
        const body = req.body;
        const {success} = loginValidationSchema.safeParse({
            email: body.email,
            password: body.password,
            username: body.username
        });
        if(!success){
            return res.status(404).json({
                message: "Please enter the valid inputs for siggning up"
            });
        }
        const user_exists = await prisma.user.findFirst({
            where:{
                OR:[
                    {
                        email: body.email
                    },
                    {
                        name: body.username
                    }
                ]
            },
        });
        if(!user_exists){
            return res.status(404).json({
                message: "The User doesnot exist please create an Account"
            });
        }
        const token = await TokenManager.generateToken(user_exists.id);
        return res.status(200).json({
            message: "User Signed In Successfully",
            token: token
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}