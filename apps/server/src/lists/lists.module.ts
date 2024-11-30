import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsRouter } from './lists.router';
import { CreateItemUseCase } from './use-cases/create-item';

@Module({
  providers: [ListsService, ListsRouter, CreateItemUseCase],
})
export class ListsModule {}
