import { Injectable } from '@nestjs/common';
import { Result } from '@server/shared/result';
import { PrismaService } from '@server/libs/prisma.service';
import { HashService } from '@server/libs/hash.service';
import {
  Account,
  AuthenticationInput,
  CreateAccountInput,
} from './dto/account-schemas';

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

  async checkCrendetials(
    input: AuthenticationInput,
  ): Promise<Result<{ id: number }>> {
    const defaultError = 'Credenciais inválidas';
    const account = await this.database.account.findUnique({
      where: {
        email: input.email,
        isActive: true,
      },
    });
    if (account === null) {
      return {
        success: false,
        error: defaultError,
      };
    }

    const passwordMatch = await this.hashService.compare(
      input.password,
      account.password,
    );
    if (passwordMatch === false) {
      return {
        success: false,
        error: defaultError,
      };
    }

    return {
      success: true,
      data: {
        id: account.id,
      },
    };
  }

  async getAccount(id: number): Promise<Result<{ account: Account }>> {
    const account = await this.database.account.findFirst({
      where: {
        id,
        isActive: true,
      },
      select: {
        avatarUrl: true,
        createdAt: true,
        email: true,
        id: true,
        isActive: true,
        name: true,
        updatedAt: true,
      },
    });

    if (account == null) {
      return {
        success: false,
        error: 'Não foi possível encontrar sua conta.',
      };
    }
    return {
      success: true,
      data: {
        account,
      },
    };
  }
}
