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
import {
  CancelInviteInput,
  cancelInviteSchema,
  CreateGroupInput,
  createGroupSchema,
  CreateInviteInput,
  createInviteSchema,
} from './schemas';
import { GroupsService } from './service';
import { Context } from '@server/trpc/app.context';
import { InviteService } from './invites-service';

@Router({ alias: 'groups' })
export class GroupsRouter {
  constructor(
    private groupService: GroupsService,
    private inviteService: InviteService,
  ) {}

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

  @UseMiddlewares(AuthMiddleware)
  @Mutation({
    input: createInviteSchema,
    output: z.object({ id: z.number() }),
  })
  async createInvite(@Ctx() ctx: Context, @Input() input: CreateInviteInput) {
    const result = await this.inviteService.invite(
      parseInt(ctx.auth.id!),
      input,
    );
    if (result.success) {
      return {
        id: result.data!.id,
      };
    }
    throw new TRPCError({
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Mutation({
    input: cancelInviteSchema,
  })
  async cancelInvite(@Ctx() ctx: Context, @Input() input: CancelInviteInput) {
    const result = await this.inviteService.cancel(
      parseInt(ctx.auth.id!),
      input,
    );
    if (result.success) {
      return;
    }
    throw new TRPCError({
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Query({
    input: z.object({
      groupId: z.number(),
    }),
    output: z.object({
      invites: z.array(
        z.object({
          id: z.number(),
          recipientEmail: z.string().email(),
          createdAt: z.date(),
        }),
      ),
    }),
  })
  async listInvites(@Ctx() ctx: Context, @Input() input: { groupId: number }) {
    const result = await this.inviteService.list(
      parseInt(ctx.auth.id!),
      input.groupId,
    );
    if (result.success) {
      return {
        invites: result.data,
      };
    }

    throw new TRPCError({
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }
}
