import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Request,Response } from "express";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/hooks/catch/:userId/:zapId",(req: Request,res: Response) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    // Store in db a new trigger
    // Push into a queue the trigger
    
})

app.listen(PORT,() => {
    console.log(`The process started at the PORT ${PORT}`);
})