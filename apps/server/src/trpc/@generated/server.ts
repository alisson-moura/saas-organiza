import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  account: t.router({
    create: publicProcedure.input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })).output(z.object({ id: z.number() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    me: publicProcedure.output(z.object({
      account: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        avatarUrl: z.string().url().nullable(),
      })
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
        .max(20, { message: 'A senha pode ter no máximo 20 caracteres.' })
        .optional()
        .or(z.literal('')),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  auth: t.router({
    login: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string().min(6).max(20),
    })).output(z.object({ token: z.string() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

