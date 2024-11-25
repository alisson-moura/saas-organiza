import { Injectable } from '@nestjs/common';
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
    const createdBy = await this.database.member.findUnique({
      where: {
        accountId_groupId: {
          accountId,
          groupId: input.groupId,
        },
      },
      select: {
        role: true,
        accountId: true,
      },
    });

    if (createdBy == null) {
      return {
        success: false,
        error: 'Você precisa estar no grupo para realizar convites.',
      };
    }
    if (createdBy.role !== 'Lider' && createdBy.role !== 'Organizador') {
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
      },
    });
    if (canceledBy == null) {
      return {
        success: false,
        error: 'Você precisa estar no grupo para cancelar um convite.',
      };
    }
    if (canceledBy.role !== 'Lider' && canceledBy.role !== 'Organizador') {
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
  ): Promise<
    Result<{ id: number; recipientEmail: string; createdAt: Date }[]>
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

    const invites = await this.database.invite.findMany({
      where: {
        groupId,
      },
      select: {
        id: true,
        recipientEmail: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      success: true,
      data: invites,
    };
  }
}
