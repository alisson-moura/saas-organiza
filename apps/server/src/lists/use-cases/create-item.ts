import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';
import { CreateItemDto } from '../dto/create-item.dto';

@Injectable()
export class CreateItemUseCase {
  constructor(private database: PrismaService) {}
  async execute(
    requesterId: number,
    input: CreateItemDto,
  ): Promise<Result<void>> {
    const list = await this.database.list.findUnique({
      where: {
        id: input.listId,
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
    if (permissions.cannot('create', 'Item')) {
      return {
        success: false,
        error: 'Você não tem permissão para criar itens nesta lista.',
      };
    }
    const titleInUse = await this.database.item.findUnique({
      where: {
        listId_title: {
          listId: input.listId,
          title: input.title,
        },
      },
    });
    if (titleInUse != null) {
      return {
        success: false,
        error: 'Já existe um item com esse título na lista.',
      };
    }

    await this.database.item.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority,
        listId: input.listId,
        assignedId: input.assignedId,
      },
    });
    return {
      success: true,
    };
  }
}
