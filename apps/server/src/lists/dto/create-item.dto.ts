import { z } from 'zod';

export const prioritySchema = z.union([
  z.literal('high'),
  z.literal('low'),
  z.literal('medium'),
]);

export const itemStatus = z.union([
  z.literal('pending'),
  z.literal('processing'),
  z.literal('done'),
]);

export const createItemDto = z.object({
  listId: z.number().positive(),
  title: z.string().min(2).max(200),
  description: z.string().nullish(),
  priority: prioritySchema,
  assignedId: z.number().positive().nullish(),
});
export type CreateItemDto = z.infer<typeof createItemDto>;
