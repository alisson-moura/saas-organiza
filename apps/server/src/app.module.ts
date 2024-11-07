import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TrpcModule } from './trpc/trpc.module';
import { LibsModule } from './libs/libs.module';

@Module({
  imports: [LibsModule, TrpcModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
