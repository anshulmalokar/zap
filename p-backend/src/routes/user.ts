import express from "express";
import { signup,signin } from "../controller/userController";

const user_router = express.Router();

user_router.post('/signup',signup);
user_router.post('/signin',signin);

export default user_router;