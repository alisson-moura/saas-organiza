import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(8, { message: 'O nome precisa ter pelo menos 8 caracteres.' })
    .max(140, { message: 'O nome pode ter no máximo 140 caracteres.' }),
  description: z
    .string({ message: 'A descrição do grupo é obrigatória.' })
    .min(20, {
      message: 'A descrição do grupo precisa ter ao menos 20 caracteres.',
    })
    .max(140, { message: 'A descrição pode ter no máximo 140 caracteres.' }),
});
export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export const createInviteSchema = z.object({
  recipientEmail: z.string().email(),
  role: z.enum(['Organizador', 'Participante', 'Observador']),
  message: z.string().max(140).optional(),
  groupId: z.number(),
});
export type CreateInviteInput = z.infer<typeof createInviteSchema>;
