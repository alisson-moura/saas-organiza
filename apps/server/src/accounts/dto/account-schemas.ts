import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const authenticationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});
export type AuthenticationInput = z.infer<typeof authenticationSchema>;

export const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatarUrl: z.string().url().nullable(),
});
export type Account = z.infer<typeof accountSchema>;

export const updataAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
    .max(20, { message: 'A senha pode ter no máximo 20 caracteres.' })
    .optional()
    .or(z.literal('')),
});
export type UpdateAccountInput = z.infer<typeof updataAccountSchema>;
