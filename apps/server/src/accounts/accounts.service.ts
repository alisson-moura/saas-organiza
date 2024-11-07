import { Injectable } from '@nestjs/common';
import { Result } from '@server/shared/result';
import { PrismaService } from '@server/libs/prisma.service';
import { HashService } from '@server/libs/hash.service';
import { CreateAccountInput } from './dto/account-schemas';

@Injectable()
export class AccountsService {
  constructor(
    private database: PrismaService,
    private hashService: HashService,
  ) {}

  async createAccount(
    input: CreateAccountInput,
  ): Promise<Result<{ id: number }>> {
    const emailAlreadyInUse = await this.database.account.findFirst({
      where: {
        email: input.email,
      },
    });
    if (emailAlreadyInUse != null) {
      return {
        success: false,
        error: 'Email já está em uso.',
      };
    }
    const hashedPassword = await this.hashService.hash(input.password);
    const account = await this.database.account.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });
    return {
      success: true,
      data: {
        id: account.id,
      },
    };
  }
}
