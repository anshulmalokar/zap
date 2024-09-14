import { Request, Response } from "express";
import { authMiddleWare } from "../middleware/middleware";
import express from "express";
import {
  createZap,
  getZapForUsers,
  getZapFromId,
} from "../controller/zapController";

const zap_router = express.Router();

zap_router.post("/", authMiddleWare, createZap);

zap_router.get("/", authMiddleWare, getZapForUsers);

zap_router.get("/:zapid", authMiddleWare, getZapFromId);

export default zap_router;
