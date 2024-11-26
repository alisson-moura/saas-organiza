import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/libs/prisma.service';
import { CreateGroupInput, GetMembersInput, GetMembersOutput } from './schemas';
import { Result } from '@server/shared/result';

@Injectable()
export class GroupsService {
  constructor(private database: PrismaService) {}

  async create(
    accountId: number,
    input: CreateGroupInput,
  ): Promise<Result<{ id: number }>> {
    const groupInDB = await this.database.group.create({
      data: {
        description: input.description,
        name: input.name,
        ownerId: accountId,
        Member: {
          create: [{ accountId, role: 'Lider' }],
        },
      },
    });

    return {
      success: true,
      data: {
        id: groupInDB.id,
      },
    };
  }

  async list(
    accountId: number,
  ): Promise<Result<{ role: string; group: { id: number; name: string } }[]>> {
    const groups = await this.database.member.findMany({
      where: {
        accountId,
      },
      select: {
        role: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      data: groups,
    };
  }

  async getMembers(
    accountId: number,
    input: GetMembersInput,
  ): Promise<Result<GetMembersOutput>> {
    const member = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId,
          groupId: input.item.groupId,
        },
      },
    });

    if (member == null) {
      return {
        success: false,
        error: 'Você só pode visualizar os membros se estiver no grupo.',
      };
    }

    const totalMembers = await this.database.member.count({
      where: {
        groupId: input.item.groupId,
      },
    });

    const members = await this.database.member.findMany({
      select: {
        role: true,
        account: true,
      },
      where: {
        groupId: input.item.groupId,
      },
      take: input.limit,
      skip: (input.page - 1) * input.limit,
      orderBy: {
        account: {
          name: 'asc',
        },
      },
    });

    const formattedMembers = members.map((member) => ({
      id: member.account.id,
      name: member.account.name,
      email: member.account.email,
      role: member.role,
    }));

    return {
      success: true,
      data: {
        items: formattedMembers,
        limit: input.limit,
        page: input.page,
        total: totalMembers,
      },
    };
  }
}
