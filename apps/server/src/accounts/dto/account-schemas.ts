import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatarUrl: z.string().url().nullable(),
});
export type Account = z.infer<typeof accountSchema>;
