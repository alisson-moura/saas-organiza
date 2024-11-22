import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { GroupsService } from './service';

describe('Groups Service', () => {
  let service: GroupsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GroupsService],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    prismaService = module.get(PrismaService);
  });

  describe('Criação de Grupo', () => {
    it('Deve criar um grupo com nome e descrição válidos', async () => {
      // Dado que eu sou um usuário autenticado
      const accountId = 1;
      const input = {
        name: 'Grupo de testes',
        description: 'Um grupo para organizar nossas compras semanais',
      };

      jest.spyOn(prismaService.group, 'create').mockResolvedValue({
        createdAt: new Date(),
        description: input.description,
        name: input.name,
        id: 1,
        ownerId: accountId,
        status: 'ACTIVE',
      });

      const result = await service.create(accountId, input);

      expect(result.success).toBeTruthy();
      expect(result.data?.id).toEqual(1);
    });
  });

  describe('Listagem de grupos', () => {
    it('deve listar os grupos do usuário', async () => {
      // Dado que eu sou um usuário autenticado
      const accountId = 1;
      // Mock da função do Prisma para simular a busca no banco
      const groups = [
        {
          role: 'Líder',
          group: {
            id: 1,
            name: 'Grupo de Estudos',
          },
        },
        {
          group: {
            id: 2,
            name: 'Equipe de Projetos',
          },
          role: 'Organizador',
        },
      ];
      jest
        .spyOn(prismaService.member, 'findMany')
        .mockResolvedValue(groups as any);

      const result = await service.list(accountId);

      expect(result.success).toBeTruthy();
      expect(result.data).toEqual(groups);
    });
  });
});
