import { NextFunction, Request, Response } from "express";
import { TokenManager } from "../utils/TokenManager";

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers["authorization"];
    const authHeader = header?.split(" ") || [];
    if (authHeader.length > 0) {
      const validate = await TokenManager.validateToken(authHeader[1]);
      if (validate === true) {
        next();
      }
    } else {
      return res.status(400).json({
        message: "Please send a valid jwt in the header",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: "Un-authorized Request",
    });
  }
};
