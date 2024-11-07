import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;
  const plainValue = 'Random@123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  test('Deve criar um hash a partir de uma string', async () => {
    const hashedValue = await service.hash(plainValue);

    expect(hashedValue).toBeDefined();
    expect(hashedValue).not.toBe(plainValue);
    expect(hashedValue.length).toBeGreaterThan(0);
  });

  test('Deve validar a string original com o hash gerado', async () => {
    const hashedValue = await service.hash(plainValue);
    const isMatch = await service.compare(plainValue, hashedValue);

    expect(isMatch).toBe(true);
  });

  test('Deve retornar false para uma string diferente da original', async () => {
    const hashedValue = await service.hash(plainValue);
    const isMatch = await service.compare('WrongValue', hashedValue);

    expect(isMatch).toBe(false);
  });
});
