import express from "express";
import dotenv from "dotenv";
import user_router from "./routes/user";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1",user_router);

app.listen(process.env.PORT || 8080,() =>{
    console.log("Server is running on port 8080");
})

