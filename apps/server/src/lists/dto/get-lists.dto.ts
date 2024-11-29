import {
  createPaginatedRequestSchema,
  createPaginatedResponseSchema,
} from '@server/shared/pagination';
import { z } from 'zod';

export const getListsDto = createPaginatedRequestSchema(
  z.object({
    groupId: z.number(),
    title: z.string().optional(),
  }),
);
export type GetListsDto = z.infer<typeof getListsDto>;

export const getListDto = z.object({
  id: z.number(),
});
export type GetListDto = z.infer<typeof getListDto>;

export const listDto = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  groupId: z.number(),
  owner: z.object({
    id: z.number(),
    name: z.string(),
  }),
});
export type ListDto = z.infer<typeof listDto>;

export const listsDto = createPaginatedResponseSchema(listDto);
export type ListsDto = z.infer<typeof listsDto>;
