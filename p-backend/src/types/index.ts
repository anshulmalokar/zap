import {z} from "zod";

export const loginValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export type LoginData = z.infer<typeof loginValidationSchema>