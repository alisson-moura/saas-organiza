import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(8, { message: 'O nome precisa ter pelo menos 2 caracteres.' })
    .max(140, { message: 'O nome pode ter no máximo 140 caracteres.' }),
  description: z
    .string({ message: 'A descrição do grupo é obrigatória.' })
    .min(20, {
      message: 'A descrição do grupo precisa ter ao menos 20 caracteres.',
    })
    .max(140, { message: 'A descrição pode ter no máximo 140 caracteres.' }),
});
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
