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
  ChangeMemberRoleInput,
  changeMemberRoleSchema,
  CreateGroupInput,
  createGroupSchema,
  CreateInviteInput,
  createInviteSchema,
  GetMembersInput,
  getMembersInputSchema,
  getMembersOutputSchema,
  RemoveMemberInput,
  removeMemberSchema,
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
      page: z.number().default(1),
      limit: z.number().default(10),
    }),
    output: z.object({
      invites: z.array(
        z.object({
          id: z.number(),
          recipientEmail: z.string().email(),
          createdAt: z.date(),
        }),
      ),
      total: z.number(),
      page: z.number(),
    }),
  })
  async listInvites(
    @Ctx() ctx: Context,
    @Input() input: { groupId: number; limit: number; page: number },
  ) {
    const result = await this.inviteService.list(
      parseInt(ctx.auth.id!),
      input.groupId,
      input.page,
      input.limit,
    );
    if (result.success) {
      return {
        ...result.data,
      };
    }

    throw new TRPCError({
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Query({
    input: getMembersInputSchema,
    output: getMembersOutputSchema,
  })
  async listMembers(@Ctx() ctx: Context, @Input() input: GetMembersInput) {
    const result = await this.groupService.getMembers(
      parseInt(ctx.auth.id!),
      input,
    );
    if (result.success) {
      return result.data;
    }

    throw new TRPCError({
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Mutation({
    input: changeMemberRoleSchema,
  })
  async changeMemberRole(
    @Ctx() ctx: Context,
    @Input() input: ChangeMemberRoleInput,
  ) {
    const result = await this.groupService.changeMemberRole(
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
  @Mutation({
    input: removeMemberSchema,
  })
  async removeMember(@Ctx() ctx: Context, @Input() input: RemoveMemberInput) {
    const result = await this.groupService.removeMember(
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
}
