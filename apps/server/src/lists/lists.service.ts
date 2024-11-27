import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { CreateListDto } from './dto/create-list.dto';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';

@Injectable()
export class ListsService {
  constructor(private database: PrismaService) {}
  async create(
    requesterId: number,
    input: CreateListDto,
  ): Promise<Result<{ id: number }>> {
    const requester = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId: requesterId,
          groupId: input.groupId,
        },
      },
    });

    if (requester == null) {
      return {
        success: false,
        error: 'Você precisa ser membro do grupo para criar uma lista.',
      };
    }

    const permissions = defineAbilitiesFor(requester.role, requester.groupId);
    if (permissions.cannot('create', 'List')) {
      return {
        success: false,
        error: 'Apenas líderes e organizadores podem criar listas.',
      };
    }

    const titleInUseByGroup = await this.database.list.findUnique({
      where: {
        groupId_title: {
          groupId: input.groupId,
          title: input.title,
        },
      },
    });
    if (titleInUseByGroup != null) {
      return {
        success: false,
        error: 'Já existe uma lista com esse nome no grupo.',
      };
    }

    const list = await this.database.list.create({
      data: {
        groupId: input.groupId,
        title: input.title,
        description: input.description,
        ownerId: requesterId,
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: {
        id: list.id,
      },
    };
  }
}
