import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HashService } from './hash.service';

@Global()
@Module({
  providers: [PrismaService, HashService],
  exports: [PrismaService, HashService],
})
export class LibsModule {}
