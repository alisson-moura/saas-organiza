import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { ChangeItemStatusUseCase } from './change-item-status';
import { ChangeItemStatusDto } from '../dto/change-item-status.dto';

describe('ChangeItemStatusUseCase', () => {
  let service: ChangeItemStatusUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ChangeItemStatusUseCase],
    }).compile();

    service = module.get<ChangeItemStatusUseCase>(ChangeItemStatusUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Mudança de status de Item', () => {
    it('deve ser possível mudar o status de um item válido', async () => {
      // Dado que o item existe e o usuário tem permissão
      const requesterId = 1;
      const changeItemStatusDto: ChangeItemStatusDto = {
        itemId: 1,
        status: 'done',
      };

      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue({
        id: changeItemStatusDto.itemId,
        assignedId: null,
        status: 'pending',
        list: {
          id: 1,
          groupId: 1,
        },
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        groupId: 1,
        role: 'Lider',
      });

      jest.spyOn(prismaService.item, 'update').mockResolvedValue({
        id: changeItemStatusDto.itemId,
        status: changeItemStatusDto.status,
      } as any);

      // Quando eu tento mudar o status do item
      const result = await service.execute(requesterId, changeItemStatusDto);

      // Então o status do item deve ser alterado
      expect(result.success).toBe(true);
    });

    it('não deve ser possível mudar o status de um item inexistente', async () => {
      // Dado que o item não existe
      const requesterId = 1;
      const changeItemStatusDto: ChangeItemStatusDto = {
        itemId: 999,
        status: 'done',
      };

      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue(null);

      // Quando eu tento mudar o status do item
      const result = await service.execute(requesterId, changeItemStatusDto);

      // Então o status do item não deve ser alterado
      expect(result.success).toBe(false);
      expect(result.error).toEqual('O item especificado não existe.');
    });

    it('não deve ser possível mudar o status se o usuário não tiver permissão', async () => {
      // Dado que o usuário não tem permissão para alterar o status do item
      const requesterId = 2;
      const changeItemStatusDto: ChangeItemStatusDto = {
        itemId: 1,
        status: 'done',
      };

      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue({
        id: changeItemStatusDto.itemId,
        assignedId: null,
        status: 'pending',
        list: {
          id: 1,
          groupId: 1,
        },
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        groupId: 1,
        role: 'Observador', // Role sem permissão
      });

      // Quando eu tento mudar o status do item
      const result = await service.execute(requesterId, changeItemStatusDto);

      // Então o status do item não deve ser alterado
      expect(result.success).toBe(false);
      expect(result.error).toEqual(
        'Você não tem permissão para alterar o status deste item.',
      );
    });

    it('deve ser possível atualizar o status e atribuir o item ao usuário requisitante', async () => {
      // Dado que o item existe e o usuário tem permissão
      const requesterId = 1;
      const changeItemStatusDto: ChangeItemStatusDto = {
        itemId: 1,
        status: 'processing',
      };

      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValue({
        id: changeItemStatusDto.itemId,
        assignedId: null,
        status: 'pending',
        list: {
          id: 1,
          groupId: 1,
        },
      } as any);

      jest.spyOn(prismaService.member, 'findUniqueOrThrow').mockResolvedValue({
        accountId: requesterId,
        groupId: 1,
        role: 'Lider',
      });

      jest.spyOn(prismaService.item, 'update').mockResolvedValue({
        id: changeItemStatusDto.itemId,
        status: changeItemStatusDto.status,
        assignedId: requesterId,
      } as any);

      // Quando eu tento atualizar o status
      const result = await service.execute(requesterId, changeItemStatusDto);

      // Então o status do item deve ser alterado e atribuído ao usuário
      expect(result.success).toBe(true);
    });
  });
});
