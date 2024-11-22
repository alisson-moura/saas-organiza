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
    it('Deve cruar um grupo com nome e descrição válidos', async () => {
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
});
