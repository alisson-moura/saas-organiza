import {
  createPaginatedRequestSchema,
  createPaginatedResponseSchema,
} from '@server/shared/pagination';
import { z } from 'zod';

export const getListsDto = createPaginatedRequestSchema(
  z.object({ groupId: z.number() }),
);
export type GetListsDto = z.infer<typeof getListsDto>;

export const listsDto = createPaginatedResponseSchema(
  z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    createdAt: z.date(),
    groupId: z.number(),
    owner: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
);
export type ListsDto = z.infer<typeof listsDto>;
