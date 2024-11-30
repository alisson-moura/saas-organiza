import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { CreateItemUseCase } from './create-item';
import { CreateItemDto } from '../dto/create-item.dto';

describe('CreateItemUseCase', () => {
  let service: CreateItemUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, CreateItemUseCase],
    }).compile();

    service = module.get<CreateItemUseCase>(CreateItemUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Criação de Item', () => {
    it('deve ser possível criar um item em uma lista válida', async () => {
      // Dado que existe uma lista válida
      const listId = 1;
      const requesterId = 1;
      const createItemDto: CreateItemDto = {
        listId,
        title: 'Novo Item',
        description: 'Descrição do item',
        priority: 'medium',
        assignedId: null,
      };

      jest.spyOn(prismaService.list, 'findUnique').mockResolvedValue({
        id: listId,
        title: 'Lista de Compras',
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        role: 'Lider',
      } as any);

      jest.spyOn(prismaService.item, 'create').mockResolvedValue({
        id: 1,
      } as any);

      // Quando eu tento criar um item na lista
      const result = await service.execute(requesterId, createItemDto);

      // Então o item deve ser criado
      expect(result.success).toBe(true);
    });

    it('não deve ser possível criar um item em uma lista inexistente', async () => {
      // Dado que a lista não existe
      const listId = 999;
      const requesterId = 1;
      const createItemDto: CreateItemDto = {
        listId,
        title: 'Item Inválido',
        description: 'Descrição',
        priority: 'low',
        assignedId: null,
      };

      jest.spyOn(prismaService.list, 'findUnique').mockResolvedValue(null);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        role: 'Lider',
      } as any);

      // Quando eu tento criar um item na lista
      const result = await service.execute(requesterId, createItemDto);

      // Então o item não deve ser criado
      expect(result.success).toBe(false);
      expect(result.error).toEqual('A lista especificada não existe.');
    });

    it('não deve ser possível criar um item com título duplicado na mesma lista', async () => {
      // Dado que existe um item com o mesmo título na lista
      const listId = 1;
      const requesterId = 1;
      const createItemDto: CreateItemDto = {
        listId,
        title: 'Item Duplicado',
        description: 'Descrição',
        priority: 'high',
        assignedId: null,
      };

      jest.spyOn(prismaService.list, 'findUnique').mockResolvedValue({
        id: listId,
        title: 'Lista de Compras',
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        role: 'Lider',
      } as any);

      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue({
        id: 1,
        title: createItemDto.title,
        listId: createItemDto.listId,
      } as any);

      // Quando eu tento criar um item com o mesmo título
      const result = await service.execute(requesterId, createItemDto);

      // Então o item não deve ser criado
      expect(result.success).toBe(false);
      expect(result.error).toEqual(
        'Já existe um item com esse título na lista.',
      );
    });

    it('não deve ser possível criar um item se o usuário não estiver autorizado', async () => {
      // Dado que o usuário não tem permissão
      const listId = 1;
      const requesterId = 2; // Usuário sem permissão
      const createItemDto: CreateItemDto = {
        listId,
        title: 'Item Sem Permissão',
        description: null,
        priority: 'medium',
        assignedId: null,
      };

      jest.spyOn(prismaService.list, 'findUnique').mockResolvedValue({
        id: listId,
        title: 'Lista de Compras',
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        role: 'Participante',
      } as any);

      // Quando eu tento criar um item na lista
      const result = await service.execute(requesterId, createItemDto);

      // Então o item não deve ser criado
      expect(result.success).toBe(false);
      expect(result.error).toEqual(
        'Você não tem permissão para criar itens nesta lista.',
      );
    });
  });
});
