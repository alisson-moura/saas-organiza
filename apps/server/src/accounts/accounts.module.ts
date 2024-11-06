import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountsRouter } from './accounts.router';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRouter],
})
export class AccountsModule {}
