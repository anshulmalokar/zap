import {z} from "zod";

export const loginValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export type LoginData = z.infer<typeof loginValidationSchema>

export const actionSchema = z.object({
  availableActionId: z.string(),
  availableActionMetaData: z.any().optional(),
});

export type ActionType = z.infer<typeof actionSchema>;

export const triggerSchema = z.object({
  availableTriggerId: z.string(),
  availableTriggerMetaData: z.any().optional(),
  availableActions: z.array(actionSchema),
});

export type TriggerType = z.infer<typeof triggerSchema>;