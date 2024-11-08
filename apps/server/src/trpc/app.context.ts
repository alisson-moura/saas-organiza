import { Injectable } from '@nestjs/common';
import { JwtService } from '@server/libs/jwt.service';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

@Injectable()
export class AppContext implements TRPCContext {
  constructor(private jwtService: JwtService) {}
  create(opts: ContextOptions) {
    const { req, res } = opts;
    const notAuthenticated = {
      req,
      res,
      auth: {
        id: null,
      },
    };
    let access_token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.access_token) {
      access_token = req.cookies.access_token as string;
    }

    if (!access_token) {
      return notAuthenticated;
    }

    try {
      const payload = this.jwtService.verifyToken(access_token);
      if (!payload.sub) {
        return notAuthenticated;
      }
      return {
        req,
        res,
        auth: {
          id: payload.sub as string,
        },
      };
    } catch (error) {
      return notAuthenticated;
    }
  }
}

export type Context = Awaited<ReturnType<typeof AppContext.prototype.create>>;
