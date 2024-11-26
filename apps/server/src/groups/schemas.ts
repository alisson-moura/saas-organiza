import {
  createPaginatedRequestSchema,
  createPaginatedResponseSchema,
} from '@server/shared/pagination';
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

export const cancelInviteSchema = z.object({
  groupId: z.number(),
  inviteId: z.number(),
});
export type CancelInviteInput = z.infer<typeof cancelInviteSchema>;

export const getMembersInputSchema = createPaginatedRequestSchema(
  z.object({ groupId: z.number() }),
);
export type GetMembersInput = z.infer<typeof getMembersInputSchema>;

export const getMembersOutputSchema = createPaginatedResponseSchema(
  z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
  }),
);
export type GetMembersOutput = z.infer<typeof getMembersOutputSchema>;

export const changeMemberRoleSchema = z.object({
  groupId: z.number(),
  accountId: z.number(),
  role: z.string(),
});
export type ChangeMemberRoleInput = z.infer<typeof changeMemberRoleSchema>;
