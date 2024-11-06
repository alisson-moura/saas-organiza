import { Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

@Injectable()
export class AppContext implements TRPCContext {
  create(
    opts: ContextOptions,
  ): Record<string, unknown> | Promise<Record<string, unknown>> {
    return {
      req: opts.req,
      auth: {
        user: '01',
      },
    };
  }
}
