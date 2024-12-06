import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsRouter } from './lists.router';
import { CreateItemUseCase } from './use-cases/create-item';
import { ListItemsUseCase } from './use-cases/list-items';
import { ChangeItemStatusUseCase } from './use-cases/change-item-status';

@Module({
  providers: [
    ListsService,
    ListsRouter,
    CreateItemUseCase,
    ListItemsUseCase,
    ChangeItemStatusUseCase,
  ],
})
export class ListsModule {}
