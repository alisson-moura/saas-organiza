import { z } from 'zod';

export const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'PORT deve ser um número válido',
    }),
  JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET é obrigatório' }),
  JWT_EXPIRES_IN: z.string().min(1, { message: 'JWT_SECRET é obrigatório' }),
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL deve ser uma URL válida' }),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export type EnvVariables = z.infer<typeof envSchema>;
