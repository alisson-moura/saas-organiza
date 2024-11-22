import {
  Router,
  Mutation,
  Input,
  UseMiddlewares,
  Ctx,
  Query,
} from 'nestjs-trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { AuthMiddleware } from '@server/trpc/auth.middleware';
import { CreateGroupInput, createGroupSchema } from './schemas';
import { GroupsService } from './service';
import { Context } from '@server/trpc/app.context';

@Router({ alias: 'groups' })
export class GroupsRouter {
  constructor(private groupService: GroupsService) {}

  @UseMiddlewares(AuthMiddleware)
  @Mutation({
    input: createGroupSchema,
    output: z.object({ id: z.number() }),
  })
  async create(@Ctx() ctx: Context, @Input() input: CreateGroupInput) {
    const result = await this.groupService.create(
      parseInt(ctx.auth.id!),
      input,
    );
    if (result.success) {
      return {
        id: result.data!.id,
      };
    }
    throw new TRPCError({
      message: 'error',
      code: 'BAD_REQUEST',
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Query({
    output: z.object({
      groups: z.array(
        z.object({
          role: z.string(),
          group: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
      ),
    }),
  })
  async list(@Ctx() ctx: Context) {
    const result = await this.groupService.list(parseInt(ctx.auth.id!));
    if (result.success) {
      return {
        groups: result.data,
      };
    }
    throw new TRPCError({
      message: 'error',
      code: 'BAD_REQUEST',
    });
  }
}
