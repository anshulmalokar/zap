import { Request, Response } from "express";
import { authMiddleWare } from "../middleware/middleware";
import express from "express";
import { createZap } from "../controller/zapController";

const zap_router = express.Router();

zap_router.post("/", authMiddleWare,createZap);

zap_router.get("/", authMiddleWare, async (req: Request, res: Response) => {

});

zap_router.get(
  "/:zapid",
  authMiddleWare,
  async (req: Request, res: Response) => {}
);
