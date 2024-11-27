import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { CreateListDto } from './dto/create-list.dto';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';
import { GetListsDto, ListsDto } from './dto/get-lists.dto';

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

  async getAll(
    requesterId: number,
    input: GetListsDto,
  ): Promise<Result<ListsDto>> {
    const requester = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId: requesterId,
          groupId: input.item.groupId,
        },
      },
    });
    if (requester == null) {
      return {
        success: false,
        error: 'Você só pode visualizar  as listas do seu grupo.',
      };
    }

    const total = await this.database.list.count({
      where: {
        groupId: input.item.groupId,
      },
    });
    const items = await this.database.list.findMany({
      where: {
        groupId: input.item.groupId,
        title: {
          contains: input.item.title,
        },
      },
      select: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        id: true,
        title: true,
        description: true,
        createdAt: true,
        groupId: true,
      },
      take: input.limit,
      skip: (input.page - 1) * input.limit,
      orderBy: {
        createdAt: 'asc',
      },
    });
    return {
      success: true,
      data: {
        items,
        total,
        limit: input.limit,
        page: input.page,
      },
    };
  }

  async delete(
    requesterId: number,
    input: { id: number },
  ): Promise<Result<void>> {
    const list = await this.database.list.findUniqueOrThrow({
      where: {
        id: input.id,
      },
    });
    const member = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId: requesterId,
          groupId: list.groupId,
        },
      },
    });

    if (member == null) {
      return {
        success: false,
        error: 'Você precisa ser membro do grupo para deletar uma lista.',
      };
    }

    const permissions = defineAbilitiesFor(member.role, member.groupId);
    if (permissions.cannot('create', 'List')) {
      return {
        success: false,
        error: 'Apenas Líderes e Organizadores podem deletar listas.',
      };
    }

    await this.database.list.delete({
      where: {
        id: list.id,
      },
    });

    return {
      success: true,
    };
  }
}
