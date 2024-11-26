import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';
import { CancelInviteInput, CreateInviteInput } from './schemas';

@Injectable()
export class InviteService {
  constructor(private database: PrismaService) {}

  async invite(
    accountId: number,
    input: CreateInviteInput,
  ): Promise<Result<{ id: number; status: string }>> {
    const createdByMember = await this.database.member.findUnique({
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

    if (createdByMember == null) {
      return {
        success: false,
        error: 'Você precisa estar no grupo para realizar convites.',
      };
    }

    const memberPermissions = defineAbilitiesFor(
      createdByMember.role,
      createdByMember.groupId,
    );
    if (memberPermissions.cannot('create', 'Invite')) {
      return {
        success: false,
        error: 'Apenas líderes e organizadores podem enviar convites.',
      };
    }

    const invite = await this.database.invite.create({
      data: {
        recipientEmail: input.recipientEmail,
        createdBy: accountId,
        groupId: input.groupId,
        role: input.role,
      },
      select: {
        id: true,
        status: true,
      },
    });
    return {
      success: true,
      data: {
        id: invite.id,
        status: invite.status,
      },
    };
  }

  async cancel(
    accountId: number,
    input: CancelInviteInput,
  ): Promise<Result<void>> {
    const canceledBy = await this.database.member.findUnique({
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
    if (canceledBy == null) {
      return {
        success: false,
        error: 'Você precisa estar no grupo para cancelar um convite.',
      };
    }
    const memberPermissions = defineAbilitiesFor(
      canceledBy.role,
      canceledBy.groupId,
    );
    if (memberPermissions.cannot('delete', 'Invite')) {
      return {
        success: false,
        error: 'Apenas líderes e organizadores podem cancelar convites.',
      };
    }

    const invite = await this.database.invite.findUnique({
      where: {
        id: input.inviteId,
        groupId: input.groupId,
      },
    });
    if (invite == null) {
      return {
        success: false,
        error: 'Não encontramos este convite.',
      };
    }

    await this.database.invite.delete({
      where: {
        id: input.inviteId,
      },
    });

    return {
      success: true,
    };
  }

  async list(
    accountId: number,
    groupId: number,
    page?: number,
    limit?: number,
  ): Promise<
    Result<{
      invites: Array<{ id: number; recipientEmail: string; createdAt: Date }>;
      page: number;
      total: number;
    }>
  > {
    const isMember = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId,
          groupId,
        },
      },
    });

    if (isMember == null) {
      return {
        success: false,
        error: 'Você só pode visualizar convites se estiver no grupo.',
      };
    }

    const total = await this.database.invite.count({
      where: {
        groupId,
      },
    });

    limit = limit ? limit : 10;
    page = page ? page : 1;
    const invites = await this.database.invite.findMany({
      where: {
        groupId,
      },
      select: {
        id: true,
        recipientEmail: true,
        createdAt: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      success: true,
      data: {
        invites,
        total,
        page,
      },
    };
  }
}
