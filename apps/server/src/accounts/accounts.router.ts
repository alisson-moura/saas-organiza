import { Router, Mutation, Input } from 'nestjs-trpc';
import { CreateAccountInput, createAccountSchema } from './dto/account-schemas';
import { AccountsService } from './accounts.service';
import { TRPCError } from '@trpc/server';

@Router({ alias: 'account' })
export class AccountsRouter {
  constructor(private accountService: AccountsService) {}

  @Mutation({ input: createAccountSchema })
  async create(@Input() input: CreateAccountInput) {
    const result = await this.accountService.createAccount(input);
    if (!result.success)
      throw new TRPCError({
        message: result.error,
        code: 'BAD_REQUEST',
      });
  }
}
