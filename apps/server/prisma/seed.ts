import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { HashService } from '../src/libs/hash.service';

const prisma = new PrismaClient();
const hashService = new HashService();

async function main() {
  console.log('Seeding database...');

  // Criar usuários
  const users = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const password = await hashService.hash('password123');
      return prisma.account.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password,
          avatarUrl: faker.image.avatar(),
        },
      });
    }),
  );

  // Criar grupos com usuários associados
  const groups = await Promise.all(
    Array.from({ length: 5 }, async () => {
      const owner = faker.helpers.arrayElement(users);
      const group = await prisma.group.create({
        data: {
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          ownerId: owner.id,
        },
      });

      // Adicionar membros ao grupo
      const members = faker.helpers.shuffle(users).slice(0, 10);
      await Promise.all(
        members.map((member, index) =>
          prisma.member.create({
            data: {
              accountId: member.id,
              groupId: group.id,
              role:
                index === 0
                  ? 'Lider'
                  : faker.helpers.arrayElement([
                      'Organizador',
                      'Participante',
                      'Observador',
                    ]),
            },
          }),
        ),
      );

      // Criar convites
      await Promise.all(
        Array.from({ length: 5 }, () =>
          prisma.invite.create({
            data: {
              groupId: group.id,
              createdBy: owner.id,
              recipientEmail: faker.internet.email(),
              role: faker.helpers.arrayElement([
                'Organizador',
                'Participante',
                'Observador',
              ]),
              expiresAt: faker.date.future(),
            },
          }),
        ),
      );

      return group;
    }),
  );

  console.log(`Created ${users.length} users and ${groups.length} groups.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
