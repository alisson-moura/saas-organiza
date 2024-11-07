import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HashService } from './hash.service';
import { JwtService } from './jwt.service';

@Global()
@Module({
  providers: [PrismaService, HashService, JwtService],
  exports: [PrismaService, HashService, JwtService],
})
export class LibsModule {}
