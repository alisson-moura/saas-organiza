import { Router, Mutation, Input, Ctx } from 'nestjs-trpc';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationInput,
  authenticationSchema,
} from '../dto/account-schemas';
import { AccountsService } from '../accounts.service';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { JwtService } from '@server/libs/jwt.service';
import { Context } from '@server/trpc/app.context';
import { CookieOptions } from 'express';

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(
    private accountService: AccountsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Mutation({
    input: authenticationSchema,
    output: z.object({ token: z.string() }),
  })
  async login(@Input() input: AuthenticationInput, @Ctx() ctx: Context) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'lax',
    };
    const accessTokenCookieOptions = {
      ...cookieOptions,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };

    const result = await this.accountService.checkCrendetials(input);

    if (result.success && result.data) {
      const token = this.jwtService.generateToken(result.data.id.toString());

      ctx.res.cookie('access_token', token, accessTokenCookieOptions);
      ctx.res.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      return {
        token,
      };
    }

    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: result.error,
    });
  }

  @Mutation()
  async logout(@Ctx() ctx: Context) {
    ctx.res.cookie('access_token', '', { maxAge: -1 });
    ctx.res.cookie('logged_in', '', { maxAge: -1 });
  }
}
