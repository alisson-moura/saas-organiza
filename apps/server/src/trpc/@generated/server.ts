import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  account: t.router({
    get: publicProcedure.output(z.object({
      name: z.string(),
      email: z.string(),
      id: z.string(),
      avatarUrl: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

