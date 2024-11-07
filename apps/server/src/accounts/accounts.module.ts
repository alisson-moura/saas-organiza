import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsRouter } from './accounts.router';

@Module({
  providers: [AccountsService, AccountsRouter],
})
export class AccountsModule {}
