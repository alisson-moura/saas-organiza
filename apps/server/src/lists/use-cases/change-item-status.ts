import { Injectable } from '@nestjs/common';
import defineAbilitiesFor from '@organiza/authorization';
import { Result } from '@server/shared/result';
import { PrismaService } from '@server/libs/prisma.service';
import { ChangeItemStatusDto } from '../dto/change-item-status.dto';

@Injectable()
export class ChangeItemStatusUseCase {
  constructor(private database: PrismaService) {}

  async execute(
    requesterId: number,
    input: ChangeItemStatusDto,
  ): Promise<Result<void>> {
    const item = await this.database.item.findUnique({
      where: { id: input.itemId },
      select: {
        id: true,
        assignedId: true,
        status: true,
        list: {
          select: {
            id: true,
            groupId: true,
          },
        },
      },
    });
    if (item == null) {
      return {
        success: false,
        error: 'O item especificado não existe.',
      };
    }
    const requester = await this.database.member.findUniqueOrThrow({
      where: {
        accountId_groupId: {
          accountId: requesterId,
          groupId: item.list.groupId,
        },
      },
    });

    const permissions = defineAbilitiesFor(requester.role, requester.groupId);
    if (permissions.cannot('update', 'Item')) {
      return {
        success: false,
        error: 'Você não tem permissão para alterar o status deste item.',
      };
    }

    await this.database.item.update({
      where: {
        id: item.id,
      },
      data: {
        status: input.status,
        assignedId: requester.accountId,
      },
    });
    return {
      success: true,
    };
  }
}
