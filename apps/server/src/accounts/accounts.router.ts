import {
  Router,
  Mutation,
  Input,
  Query,
  UseMiddlewares,
  Ctx,
} from 'nestjs-trpc';
import {
  accountSchema,
  AuthenticationInput,
  authenticationSchema,
  CreateAccountInput,
  createAccountSchema,
} from './dto/account-schemas';
import { AccountsService } from './accounts.service';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { JwtService } from '@server/libs/jwt.service';
import { AuthMiddleware } from '@server/trpc/auth.middleware';
import { Context } from '@server/trpc/app.context';

@Router({ alias: 'account' })
export class AccountsRouter {
  constructor(
    private accountService: AccountsService,
    private jwtService: JwtService,
  ) {}

  @Mutation({
    input: createAccountSchema,
    output: z.object({ id: z.number() }),
  })
  async create(@Input() input: CreateAccountInput) {
    const result = await this.accountService.createAccount(input);
    if (!result.success)
      throw new TRPCError({
        message: result.error,
        code: 'BAD_REQUEST',
      });
    return {
      id: result.data!.id,
    };
  }

  @Mutation({
    input: authenticationSchema,
    output: z.object({ token: z.string() }),
  })
  async auth(@Input() input: AuthenticationInput) {
    const result = await this.accountService.checkCrendetials(input);

    if (result.success && result.data) {
      const token = this.jwtService.generateToken(result.data.id.toString());
      return {
        token,
      };
    }

    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: result.error,
    });
  }

  @UseMiddlewares(AuthMiddleware)
  @Query({ output: z.object({ account: accountSchema }) })
  async me(@Ctx() ctx: Context) {
    const result = await this.accountService.getAccount(parseInt(ctx.auth.id!));
    console.log(result);
    if (result.success) {
      return {
        account: result.data?.account,
      };
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: result.error,
    });
  }
}
