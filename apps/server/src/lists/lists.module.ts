import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsRouter } from './lists.router';
import { CreateItemUseCase } from './use-cases/create-item';
import { ListItemsUseCase } from './use-cases/list-items';

@Module({
  providers: [ListsService, ListsRouter, CreateItemUseCase, ListItemsUseCase],
})
export class ListsModule {}
