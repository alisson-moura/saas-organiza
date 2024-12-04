import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';
import { GetItems, Items } from '../dto/get-items.dto';

@Injectable()
export class ListItemsUseCase {
  constructor(private database: PrismaService) {}
  async execute(requesterId: number, input: GetItems): Promise<Result<Items>> {
    const list = await this.database.list.findUnique({
      where: {
        id: input.item.listId,
      },
    });
    if (list == null) {
      return {
        success: false,
        error: 'A lista especificada não existe.',
      };
    }

    const requester = await this.database.member.findUniqueOrThrow({
      where: {
        accountId_groupId: {
          accountId: requesterId,
          groupId: list.groupId,
        },
      },
    });
    const permissions = defineAbilitiesFor(requester.role, requester.groupId);
    if (permissions.cannot('read', 'Item')) {
      return {
        success: false,
        error: 'Você não tem permissão para ver os items desta lista.',
      };
    }

    const items = await this.database.item.findMany({
      where: {
        listId: list.id,
        title: input.item.title,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        listId: true,
        createdAt: true,
        updatedAt: true,
        assigned: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: input.limit,
      skip: (input.page - 1) * input.limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: {
        total: 0,
        page: input.page,
        limit: input.limit,
        items,
      },
    };
  }
}
