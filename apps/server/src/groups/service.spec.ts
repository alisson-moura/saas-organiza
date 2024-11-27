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

  describe('Alteração de Papel do Membro', () => {
    const accountId = 1;
    const groupId = 1;
    const input = {
      accountId: 2,
      groupId,
      role: 'Organizador',
    };

    it('Deve alterar o papel do membro com permissões válidas', async () => {
      // Dado que o membro existe no grupo e tenho permissão para alterar o papel
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Lider',
        accountId,
        groupId,
      });

      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue(null); // Não é o dono do grupo

      jest.spyOn(prismaService.member, 'update').mockResolvedValue(null as any); // Atualização simulada

      // Quando a função é chamada
      const result = await service.changeMemberRole(accountId, input);

      // Então o papel do membro deve ser alterado com sucesso
      expect(result.success).toBeTruthy();
      expect(prismaService.member.update).toHaveBeenCalledWith({
        where: {
          accountId_groupId: {
            accountId: input.accountId,
            groupId: input.groupId,
          },
        },
        data: {
          role: input.role,
        },
      });
    });

    it('Não deve permitir alterar o papel de um membro que não está no grupo', async () => {
      // Dado que o membro não existe no grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue(null);

      // Quando a função é chamada
      const result = await service.changeMemberRole(accountId, input);

      // Então deve retornar erro indicando que o membro não está no grupo
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(
        'Você precisa estar no grupo para alterar um papel.',
      );
    });

    it('Não deve permitir alterar o papel sem permissão adequada', async () => {
      // Dado que o membro existe no grupo, mas não tem permissão
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Participante',
        accountId,
        groupId,
      });

      // Quando a função é chamada
      const result = await service.changeMemberRole(accountId, input);

      // Então deve retornar erro indicando falta de permissão
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(
        'Apenas líderes e organizadores podem alterar papeis.',
      );
    });

    it('Não deve permitir alterar o papel do dono do grupo', async () => {
      // Dado que o membro é o dono do grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Lider',
        accountId,
        groupId,
      });

      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue({
        id: groupId,
        ownerId: input.accountId,
      } as any);

      // Quando a função é chamada
      const result = await service.changeMemberRole(accountId, input);

      // Então deve retornar erro indicando que o papel do dono não pode ser alterado
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(
        'Não é possível alterar o papel do dono do grupo.',
      );
    });
  });

  describe('Remoção de Membro do Grupo', () => {
    const accountId = 1; // ID do usuário que executa a ação
    const groupId = 1; // ID do grupo
    const input = { groupId, memberId: 2 }; // ID do membro a ser removido

    it('Deve remover um membro do grupo quando o usuário for líder', async () => {
      // Dado que o usuário é líder no grupo e o membro não é o dono do grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Lider',
        accountId,
        groupId,
      });

      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue(null); // O membro não é o dono do grupo

      jest.spyOn(prismaService.member, 'delete').mockResolvedValue(null as any); // Simula a remoção do membro

      // Quando a função é chamada
      const result = await service.removeMember(accountId, input);

      // Então o membro deve ser removido com sucesso
      expect(result.success).toBeTruthy();
      expect(prismaService.member.delete).toHaveBeenCalledWith({
        where: {
          accountId_groupId: {
            accountId: input.memberId,
            groupId: input.groupId,
          },
        },
      });
    });

    it('Não deve permitir remover um membro quando o usuário não for líder', async () => {
      // Dado que o usuário não é líder no grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Organizador',
        accountId,
        groupId,
      });

      // Quando a função é chamada
      const result = await service.removeMember(accountId, input);

      // Então deve retornar um erro indicando falta de permissão
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(
        'Apenas líderes podem remover membros do grupo.',
      );
    });

    it('Não deve permitir remover o dono do grupo', async () => {
      // Dado que o membro a ser removido é o dono do grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        role: 'Lider',
        accountId,
        groupId,
      });

      jest.spyOn(prismaService.group, 'findUnique').mockResolvedValue({
        id: groupId,
        ownerId: input.memberId, // O membro é o dono do grupo
      } as any);

      // Quando a função é chamada
      const result = await service.removeMember(accountId, input);

      // Então deve retornar um erro indicando que o dono do grupo não pode ser removido
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual('O dono do grupo não pode ser removido.');
    });

    it('Não deve permitir remover um membro que não existe no grupo', async () => {
      // Dado que o membro não existe no grupo
      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue(null);

      // Quando a função é chamada
      const result = await service.removeMember(accountId, input);

      // Então deve retornar um erro indicando que o membro não foi encontrado
      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(
        'Você precisa estar no grupo para alterar um papel.',
      );
    });
  });
});
