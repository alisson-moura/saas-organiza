import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/libs/prisma.service';
import { CreateGroupInput } from './schemas';
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
}
