import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import { Context } from './app.context';

@Injectable()
export class AuthMiddleware implements TRPCMiddleware {
  constructor() {}

  use(
    opts: MiddlewareOptions<Context>,
  ): MiddlewareResponse | Promise<MiddlewareResponse> {
    const { ctx, next } = opts;

    if (ctx.auth.id == null) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    return next({
      ctx: {
        auth: {
          id: ctx.auth.id,
        },
      },
    });
  }
}
