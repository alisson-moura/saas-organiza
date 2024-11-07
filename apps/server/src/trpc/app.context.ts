import { Injectable } from '@nestjs/common';
import { JwtService } from '@server/libs/jwt.service';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

@Injectable()
export class AppContext implements TRPCContext {
  constructor(private jwtService: JwtService) {}
  create(opts: ContextOptions) {
    const accountId = this.getAccountFromHeader(opts.req.headers);
    return {
      auth: {
        id: accountId,
      },
    };
  }

  private getAccountFromHeader(headers: Record<string, string>) {
    try {
      const jwtPayload = this.jwtService.verifyToken(
        headers.authorization.split(' ')[1],
      );
      return jwtPayload.sub as string;
    } catch (error) {
      return null;
    }
  }
}

export type Context = Awaited<ReturnType<typeof AppContext.prototype.create>>;
