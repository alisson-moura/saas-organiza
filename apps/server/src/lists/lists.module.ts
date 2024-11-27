import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsRouter } from './lists.router';

@Module({
  providers: [ListsService, ListsRouter],
})
export class ListsModule {}
