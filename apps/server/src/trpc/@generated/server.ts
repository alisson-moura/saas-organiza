import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createPaginatedResponseSchema } from "../../shared/pagination";
import { createPaginatedRequestSchema } from "../../shared/pagination";

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
    check: publicProcedure.output(z.object({ isAuthenticated: z.boolean() })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  groups: t.router({
    create: publicProcedure.input(z.object({
      name: z
        .string()
        .min(8, { message: 'O nome precisa ter pelo menos 8 caracteres.' })
        .max(140, { message: 'O nome pode ter no máximo 140 caracteres.' }),
      description: z
        .string({ message: 'A descrição do grupo é obrigatória.' })
        .min(20, {
          message: 'A descrição do grupo precisa ter ao menos 20 caracteres.',
        })
        .max(140, { message: 'A descrição pode ter no máximo 140 caracteres.' }),
    })).output(z.object({ id: z.number() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    list: publicProcedure.output(z.object({
      groups: z.array(
        z.object({
          role: z.string(),
          group: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
      ),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createInvite: publicProcedure.input(z.object({
      recipientEmail: z.string().email(),
      role: z.enum(['Organizador', 'Participante', 'Observador']),
      message: z.string().max(140).optional(),
      groupId: z.number(),
    })).output(z.object({ id: z.number() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    cancelInvite: publicProcedure.input(z.object({
      groupId: z.number(),
      inviteId: z.number(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    listInvites: publicProcedure.input(z.object({
      groupId: z.number(),
      page: z.number().default(1),
      limit: z.number().default(10),
    })).output(z.object({
      invites: z.array(
        z.object({
          id: z.number(),
          recipientEmail: z.string().email(),
          createdAt: z.date(),
        }),
      ),
      total: z.number(),
      page: z.number(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    listMembers: publicProcedure.input(createPaginatedRequestSchema(
      z.object({ groupId: z.number() }),
    )).output(createPaginatedResponseSchema(
      z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        role: z.string(),
      }),
    )).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    changeMemberRole: publicProcedure.input(z.object({
      groupId: z.number(),
      accountId: z.number(),
      role: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    removeMember: publicProcedure.input(z.object({
      groupId: z.number(),
      memberId: z.number(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

