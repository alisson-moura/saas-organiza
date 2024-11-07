import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@server/libs/prisma.service';
import { HashService } from '@server/libs/hash.service';
import { CreateAccountInput } from './dto/account-schemas';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let prismaService: PrismaService;
  let hashService: HashService;
  const fakeUser = {
    name: 'John Doe',
    email: 'jonh@mail.com',
    password: 'fake_password',
    id: 1,
    isActive: true,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        PrismaService,
        {
          provide: HashService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    prismaService = module.get(PrismaService);
    hashService = module.get(HashService);
  });

  it('Deve criar uma conta com sucesso quando o email não está em uso', async () => {
    const input: CreateAccountInput = {
      name: 'John Doe',
      email: 'jonh@mail.com',
      password: 'fake_password',
    };
    const hashedPassword = 'hashedPassword123';

    jest.spyOn(prismaService.account, 'findFirst').mockResolvedValue(null);
    jest.spyOn(hashService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(prismaService.account, 'create').mockResolvedValue({
      ...fakeUser,
      password: hashedPassword,
    });

    const result = await service.createAccount(input);

    expect(result).toEqual({ success: true, data: { id: 1 } });
    expect(prismaService.account.findFirst).toHaveBeenCalledWith({
      where: { email: input.email },
    });
    expect(hashService.hash).toHaveBeenCalledWith(input.password);
    expect(prismaService.account.create).toHaveBeenCalledWith({
      data: {
        ...input,
        password: hashedPassword,
      },
    });
  });

  it('Deve retornar erro quando o email já está em uso', async () => {
    const input: CreateAccountInput = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    // Espionar e mockar os métodos
    jest.spyOn(prismaService.account, 'findFirst').mockResolvedValue(fakeUser);

    const result = await service.createAccount(input);

    expect(result).toEqual({ success: false, error: 'Email já está em uso.' });
    expect(prismaService.account.findFirst).toHaveBeenCalledWith({
      where: { email: input.email },
    });
    expect(hashService.hash).not.toHaveBeenCalled();
  });
});
