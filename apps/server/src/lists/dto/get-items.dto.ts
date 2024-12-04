import {
  createPaginatedRequestSchema,
  createPaginatedResponseSchema,
} from '@server/shared/pagination';
import { z } from 'zod';

export const itemDto = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullish(),
  status: z.union([
    z.literal('pending'),
    z.literal('processing'),
    z.literal('done'),
  ]),
  priority: z.union([z.literal('high'), z.literal('low'), z.literal('medium')]),
  listId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assigned: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullish(),
});
export type Item = z.infer<typeof itemDto>;

export const getItemsDto = createPaginatedRequestSchema(
  z.object({
    listId: z.number(),
    title: z.string().optional(),
  }),
);
export type GetItems = z.infer<typeof getItemsDto>;

export const itemsDto = createPaginatedResponseSchema(itemDto);
export type Items = z.infer<typeof itemsDto>;
