import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsRouter } from './routers/accounts.router';
import { AuthRouter } from './routers/auth.router';

@Module({
  providers: [AccountsService, AccountsRouter, AuthRouter],
})
export class AccountsModule {}
