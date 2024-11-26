import { z } from 'zod';

export function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType,
) {
  return z.object({
    total: z.number(),
    page: z.number().default(1),
    limit: z.number().min(5).max(50).default(10),
    items: z.array(itemSchema),
  });
}

export function createPaginatedRequestSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType,
) {
  return z.object({
    item: itemSchema,
    page: z.number().min(1).default(1),
    limit: z.number().min(5).max(50).default(10),
  });
}
