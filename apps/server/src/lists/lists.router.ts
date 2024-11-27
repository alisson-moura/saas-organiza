import { ListsService } from './lists.service';
import { createListDto, CreateListDto } from './dto/create-list.dto';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { AuthMiddleware } from '@server/trpc/auth.middleware';
import { z } from 'zod';
import { Context } from '@server/trpc/app.context';
import { TRPCError } from '@trpc/server';
import { getListsDto, GetListsDto, listsDto } from './dto/get-lists.dto';

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
      message: result.error,
      code: 'BAD_REQUEST',
    });
  }

  @Query({
    input: getListsDto,
    output: listsDto,
  })
  async getAll(@Ctx() ctx: Context, @Input() input: GetListsDto) {
    const result = await this.listsService.getAll(
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
}
