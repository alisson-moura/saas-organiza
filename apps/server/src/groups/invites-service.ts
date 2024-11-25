import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/libs/prisma.service';
import { Result } from '@server/shared/result';
import { CreateInviteInput } from './schemas';

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
}
