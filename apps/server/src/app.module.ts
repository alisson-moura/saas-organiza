import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [TrpcModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
