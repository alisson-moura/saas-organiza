import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/libs/prisma.service';
import {
  ChangeMemberRoleInput,
  CreateGroupInput,
  GetMembersInput,
  GetMembersOutput,
  RemoveMemberInput,
} from './schemas';
import { Result } from '@server/shared/result';
import defineAbilitiesFor from '@organiza/authorization';

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

  async changeMemberRole(
    accountId: number,
    input: ChangeMemberRoleInput,
  ): Promise<Result<void>> {
    const member = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId,
          groupId: input.groupId,
        },
      },
      select: {
        role: true,
        accountId: true,
        groupId: true,
      },
    });
    if (member == null) {
      return {
        success: false,
        error: 'Você precisa estar no grupo para alterar um papel.',
      };
    }

    const permissions = defineAbilitiesFor(member.role, member.groupId);
    if (permissions.cannot('update', 'Member')) {
      return {
        success: false,
        error: 'Apenas líderes e organizadores podem alterar papeis.',
      };
    }

    const isOwnerGroup = await this.database.group.findUnique({
      where: {
        id: input.groupId,
        ownerId: input.accountId,
      },
    });
    if (isOwnerGroup) {
      return {
        success: false,
        error: 'Não é possível alterar o papel do dono do grupo.',
      };
    }

    await this.database.member.update({
      where: {
        accountId_groupId: {
          accountId: input.accountId,
          groupId: input.groupId,
        },
      },
      data: {
        role: input.role as any,
      },
    });

    return {
      success: true,
    };
  }

  async removeMember(
    requesterId: number,
    input: RemoveMemberInput,
  ): Promise<Result<void>> {
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
        error: 'Você precisa estar no grupo para alterar um papel.',
      };
    }

    const permissions = defineAbilitiesFor(requester.role, requester.groupId);
    if (permissions.cannot('delete', 'Member')) {
      return {
        success: false,
        error: 'Apenas líderes podem remover membros do grupo.',
      };
    }

    const isOwner = await this.database.group.findUnique({
      where: {
        id: input.groupId,
        ownerId: input.memberId,
      },
    });
    if (isOwner != null) {
      return {
        success: false,
        error: 'O dono do grupo não pode ser removido.',
      };
    }

    await this.database.member.delete({
      where: {
        accountId_groupId: {
          accountId: input.memberId,
          groupId: input.groupId,
        },
      },
    });

    return {
      success: true,
    };
  }
}
