import { ListsService } from './lists.service';
import { createListDto, CreateListDto } from './dto/create-list.dto';
import { Ctx, Input, Mutation, Router, UseMiddlewares } from 'nestjs-trpc';
import { AuthMiddleware } from '@server/trpc/auth.middleware';
import { z } from 'zod';
import { Context } from '@server/trpc/app.context';
import { TRPCError } from '@trpc/server';

@UseMiddlewares(AuthMiddleware)
@Router({ alias: 'lists' })
export class ListsRouter {
  constructor(private readonly listsService: ListsService) {}

  @Mutation({
    input: createListDto,
    output: z.object({ id: z.number() }),
  })
  async create(@Ctx() ctx: Context, @Input() createListDto: CreateListDto) {
    const result = await this.listsService.create(
      parseInt(ctx.auth.id!),
      createListDto,
    );
    if (result.success) {
      return {
        id: result.data?.id,
      };
    }
    throw new TRPCError({
      message: 'error',
      code: 'BAD_REQUEST',
    });
  }
}
