import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { InviteService } from './invites-service';

describe('Invite Service', () => {
  let service: InviteService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, InviteService],
    }).compile();

    service = module.get<InviteService>(InviteService);
    prismaService = module.get(PrismaService);
  });

  describe('Criação de Convite', () => {
    it('deve ser possível que o líder envie um convite', async () => {
      // Dado que eu sou o Líder de um grupo
      const lider = { id: 1, role: 'Lider', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: lider.id,
        role: lider.role,
      } as any);
      jest.spyOn(prismaService.invite, 'create').mockResolvedValue({
        id: 1,
        status: 'Pending',
      } as any);

      // Quando eu seleciono a opção "Convidar Membro"
      const invite = await service.invite(lider.id, {
        recipientEmail: 'john.doe@mail.com',
        message: 'Hello John.',
        groupId: lider.groupId,
        role: 'Organizador',
      });

      // Então o convite deve ser enviado
      expect(invite.success).toBe(true);
      expect(invite.data!.status).toEqual('Pending');
    });
    it('não deve ser possível que um membro que não seja líder ou organizar envie um convite', async () => {
      // Dado que eu não sou o Líder de um grupo
      const participante = { id: 1, role: 'Participante', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: participante.id,
        role: participante.role,
      } as any);

      // Quando eu seleciono a opção "Convidar Membro"
      const invite = await service.invite(participante.id, {
        recipientEmail: 'john.doe@mail.com',
        message: 'Hello John.',
        groupId: participante.groupId,
        role: 'Organizador',
      });

      // Então o convite não deve ser enviado
      expect(invite.success).toBe(false);
      expect(invite.error).toEqual(
        'Apenas líderes e organizadores podem enviar convites.',
      );
    });
    it('não deve ser possível que uma pessoa que não é membro envie um convite', async () => {
      // Dado que eu não sou membro de um grupo
      const participante = { id: 1, role: 'Lider', groupId: 2 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue(null);

      // Quando eu seleciono a opção "Convidar Membro"
      const invite = await service.invite(participante.id, {
        recipientEmail: 'john.doe@mail.com',
        message: 'Hello John.',
        groupId: 1,
        role: 'Organizador',
      });

      // Então o convite não deve ser enviado
      expect(invite.success).toBe(false);
      expect(invite.error).toEqual(
        'Você precisa estar no grupo para realizar convites.',
      );
    });
    it.todo('não deve ser possível convidar um membro que já está no grupo');
    it.todo(
      'não deve ser possível convidar um membro que já possui um convite com o status de pendente',
    );
  });

  describe('Cancelar convite', () => {
    it('deve ser possível que o líder cancele um convite', async () => {
      // Dado que eu sou o Líder de um grupo
      const lider = { id: 1, role: 'Lider', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: lider.id,
        role: lider.role as any,
        groupId: lider.groupId,
      });
      jest
        .spyOn(prismaService.invite, 'findUnique')
        .mockResolvedValue({} as any);
      jest.spyOn(prismaService.invite, 'delete').mockResolvedValue({} as any);

      // Quando eu seleciono a opção "Cancelar convite"
      const invite = await service.cancel(lider.id, {
        inviteId: 1,
        groupId: lider.groupId,
      });

      // Então o convite deve ser cancelado
      expect(invite.success).toBe(true);
    });
    it('não deve ser possível que um membro que não seja líder ou organizar cancele um convite', async () => {
      // Dado que eu não sou o Líder de um grupo
      const participante = { id: 1, role: 'Participante', groupId: 1 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue({
        accountId: participante.id,
        role: participante.role,
      } as any);

      // Quando eu seleciono a opção "Cancelar convite"
      const invite = await service.cancel(participante.id, {
        inviteId: 1,
        groupId: participante.groupId,
      });

      // Então o convite não deve ser cancelado
      expect(invite.success).toBe(false);
      expect(invite.error).toEqual(
        'Apenas líderes e organizadores podem cancelar convites.',
      );
    });
    it('não deve ser possível que uma pessoa que não é membro cancele um convite', async () => {
      // Dado que eu não sou membro de um grupo
      const participante = { id: 1, role: 'Lider', groupId: 2 };

      jest.spyOn(prismaService.member, 'findUnique').mockResolvedValue(null);

      // Quando eu seleciono a opção "Cancelar convite"
      const invite = await service.cancel(participante.id, {
        inviteId: 1,
        groupId: 2,
      });

      // Então o convite não deve ser cancelado
      expect(invite.success).toBe(false);
      expect(invite.error).toEqual(
        'Você precisa estar no grupo para cancelar um convite.',
      );
    });
  });
});
