import { Module } from '@nestjs/common';
import { GroupsRouter } from './router';
import { GroupsService } from './service';

@Module({
  providers: [GroupsRouter, GroupsService],
})
export class GroupsModule {}
