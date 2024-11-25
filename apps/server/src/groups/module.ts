import { Module } from '@nestjs/common';
import { GroupsRouter } from './router';
import { GroupsService } from './service';
import { InviteService } from './invites-service';

@Module({
  providers: [GroupsRouter, GroupsService, InviteService],
})
export class GroupsModule {}
