import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  generateToken(id: string): string {
    const payload = { sub: id };
    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET');
    const options = {
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    };

    return jwt.sign(payload, secretKey, options);
  }

  verifyToken(token: string) {
    const secretKey = this.configService.getOrThrow<string>('JWT_SECRET');

    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      throw new Error('Token inválido');
    }
  }
}
