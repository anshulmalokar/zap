import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Request,Response } from "express";
import prisma from "./db";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health",(req,res) => {
    return res.status(200).json({
        message: "Hello World"
    })
});

app.post("/hooks/catch/:userId/:zapId",async (req: Request,res: Response) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const metaData = JSON.stringify(req.body);
    try{
        await prisma.$transaction(async tx => {
            const zap_run = await tx.zapRun.create({
                data:{
                    zapId: zapId as string,
                    metaData: JSON.parse(metaData)
                }
            });
            await tx.zapRunOutBox.create({
                data:{
                    zapRunId: zap_run.id
                }
            })
        });
        return res.status(200).json({
            message: "Request Successful"
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Request Failed"
        })
    }
})

app.listen(PORT,() => {
    console.log(`The process started at the PORT ${PORT}`);
})