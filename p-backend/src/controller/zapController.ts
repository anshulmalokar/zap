import { Request, Response } from "express";
import { ActionType, triggerSchema, TriggerType } from "../types";
import prisma from "../db";
import Validator from "../utils/validators";

export const createZap = async (req: Request, res: Response) => {
    try{
      const {success} = triggerSchema.safeParse(req.body);
      if(!success){
        return res.status(404).json({
          message: "Please provide a valid zap schema"
        });
      }
      const body: TriggerType = req.body;
      const {availableTriggerId,availableTriggerMetaData} = req.body;
      const availableActions:ActionType[] = req.body.availableActions;
      if (!Array.isArray(availableActions)) {
        return res.status(404).json({
          message: "Please provide a valid available action array"
        });
      }
  
      try{
        availableActions.map(async action  => {
          await Validator.getInstance().checkAction(action.availableActionId)
        })
      }catch(e){
        return res.status(404).json({
          message: "Please provide a valid available action"
        })
      }
  
      try{
        await Validator.getInstance().checkTrigger(availableTriggerId);
      }catch(e){
        return res.status(404).json({
          message: "Please provide a valid available Trigger"
        })
      }
      await prisma.$transaction(async tx => {
        // First a zap needs to be created
        const zap = await tx.zap.create({});
        // Create the trigger based on the received triggerId
        await tx.trigger.create({
          data:{
            zapId: zap.id,
            availableTriggerId: availableTriggerId
          }
        });
        // Create the following actions one by one
        availableActions.map(async (action) => {
          await tx.action.create({
            data:{
              zapId: zap.id,
              actionId: action.availableActionId
            }
          });
        });
      });
      return res.status(200).json({
        message: "Zap Successfully Created"
      });
    }catch(e){
      return res.status(500).json({
        message: "Internal Server Error"
      })
    }
}  