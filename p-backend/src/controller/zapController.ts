import { Request, Response } from "express";
import { ActionType, triggerSchema, TriggerType } from "../types";
import prisma from "../db";
import Validator from "../utils/validators";
import { TokenManager } from "../utils/TokenManager";

export const createZap = async (req: Request, res: Response) => {
  try {
    const { success } = triggerSchema.safeParse(req.body);
    if (!success) {
      return res.status(404).json({
        message: "Please provide a valid zap schema",
      });
    }
    let response;
    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      response = await TokenManager.decodeToken(token);
    }
    // @ts-ignore
    const userId = response !== undefined ? response.userId : "";
    if (userId === "") {
      return res.status(404).json({
        message: "Please provide a valid token",
      });
    }
    const { availableTriggerId, availableTriggerMetaData } = req.body;
    const availableActions: ActionType[] = req.body.availableActions;
    if (!Array.isArray(availableActions)) {
      return res.status(404).json({
        message: "Please provide a valid available action array",
      });
    }

    try {
      availableActions.map(async (action) => {
        await Validator.getInstance().checkAction(action.availableActionId);
      });
    } catch (e) {
      return res.status(404).json({
        message: "Please provide a valid available action",
      });
    }

    try {
      await Validator.getInstance().checkTrigger(availableTriggerId);
    } catch (e) {
      return res.status(404).json({
        message: "Please provide a valid available Trigger",
      });
    }
    let zapId;
    await prisma.$transaction(async (tx) => {
      // First a zap needs to be created
      const zap = await tx.zap.create({
        data: {
          userId: parseInt(userId),
        },
      });
      zapId = zap.id;
      // Create the trigger based on the received triggerId
      await tx.trigger.create({
        data: {
          zapId: zap.id,
          availableTriggerId: availableTriggerId,
        },
      });
      // Create the following actions one by one
      const promisesActions = availableActions.map(async (action, idx) => {
        await tx.action.create({
          data: {
            zapId: zap.id,
            actionId: action.availableActionId,
            sortingOrder: idx + 1,
          },
        });
      });
      await Promise.all(promisesActions);
    });
    return res.status(200).json({
      message: "Zap Successfully Created",
      id: zapId,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getZapForUsers = async (req: Request, res: Response) => {
  try {
    let response;
    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      response = await TokenManager.decodeToken(token);
    }
    // @ts-ignore
    const userId = response !== undefined ? response.userId : "";
    if (userId === "") {
      return res.status(404).json({
        message: "Please provide a valid token",
      });
    }
    const zap = await prisma.zap.findMany({
      where: {
        userId: userId,
      },
      include: {
        trigger: {
          include: {
            availableTrigger: true,
          },
        },
        action: {
          include: {
            availableAction: true,
          },
        },
      },
    });
    return res.status(200).json({
      zaps: zap,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getZapFromId = async (req: Request, res: Response) => {
  try {
    let response;
    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      response = await TokenManager.decodeToken(token);
    }
    // @ts-ignore
    const userId = response !== undefined ? response.userId : "";
    const zapid = req.params.zapid;
    const data = await prisma.zap.findFirst({
      where: {
        id: zapid,
        userId: userId,
      },
      select: {
        trigger: {
          include: {
            availableTrigger: true,
          },
        },
        action: {
          include: {
            availableAction: true,
          },
        },
      },
    });
    return res.status(200).json({
      data: data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
