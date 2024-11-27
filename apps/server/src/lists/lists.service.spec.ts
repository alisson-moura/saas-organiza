import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { ListsService } from './lists.service';

describe('List Service', () => {
  let service: ListsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ListsService],
    }).compile();

    service = module.get<ListsService>(ListsService);
    prismaService = module.get(PrismaService);
  });

  describe('Criação de Lista', () => {
    it('deve ser possível que o líder crie uma lista', async () => {
      // Dado que eu sou o Líder de um grupo
      const lider = { id: 1, role: 'Lider', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: lider.id,
        role: lider.role,
      } as any);

      jest.spyOn(prismaService.list, 'create').mockResolvedValue({
        id: 1,
      } as any);

      // Quando eu tento criar uma lista
      const list = await service.create(lider.id, {
        title: 'Lista de Compras',
        description: 'Lista de Compras',
        groupId: lider.groupId,
      });

      // Então a lista deve ser criada
      expect(list.success).toBe(true);
      expect(list.data!.id).toEqual(1);
    });

    it('não deve ser possível que um Participante crie uma lista', async () => {
      // Dado que eu sou um Participante de um grupo
      const participante = { id: 3, role: 'Participante', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: participante.id,
        role: participante.role,
      } as any);

      // Quando eu tento criar uma lista
      const list = await service.create(participante.id, {
        title: 'Lista Restrita',
        description: 'Lista Restrita',
        groupId: participante.groupId,
      });

      // Então a lista não deve ser criada
      expect(list.success).toBe(false);
      expect(list.error).toEqual(
        'Apenas líderes e organizadores podem criar listas.',
      );
    });

    it('não deve ser possível criar uma lista se o usuário não for membro do grupo', async () => {
      // Dado que eu não sou membro de um grupo
      const naoMembro = { id: 5, role: 'Lider', groupId: 2 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue(null);

      // Quando eu tento criar uma lista
      const list = await service.create(naoMembro.id, {
        title: 'Lista de Compras',
        description: 'Lista de Compras',
        groupId: 1,
      });

      // Então a lista não deve ser criada
      expect(list.success).toBe(false);
      expect(list.error).toEqual(
        'Você precisa ser membro do grupo para criar uma lista.',
      );
    });

    it('não deve ser possível criar uma lista com um nome duplicado no mesmo grupo', async () => {
      // Dado que eu sou o Líder de um grupo
      const lider = { id: 1, role: 'Lider', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: lider.id,
        role: lider.role,
      } as any);

      jest.spyOn(prismaService.list, 'findUnique').mockResolvedValue({
        id: 1,
        name: 'Lista de Compras',
        groupId: lider.groupId,
      } as any);

      // Quando eu tento criar uma lista com o mesmo nome
      const list = await service.create(lider.id, {
        title: 'Lista de Compras',
        description: 'Lista de Compras',
        groupId: lider.groupId,
      });

      // Então a lista não deve ser criada
      expect(list.success).toBe(false);
      expect(list.error).toEqual('Já existe uma lista com esse nome no grupo.');
    });
  });
});
