import { Router, Query } from 'nestjs-trpc';
import { z } from 'zod';

const accountSchema = z.object({
  name: z.string(),
  email: z.string(),
  id: z.string(),
  avatarUrl: z.string(),
});

@Router({ alias: 'account' })
export class AccountsRouter {
  @Query({ output: accountSchema })
  async get(): Promise<z.infer<typeof accountSchema>> {
    return {
      id: '01',
      name: 'Alisson Moura',
      avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg',
      email: 'alisson.mo.moura@outlook.com',
    };
  }
}
