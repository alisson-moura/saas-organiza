import { z } from 'zod';

export const createListDto = z.object({
  title: z.string(),
  description: z.string(),
  groupId: z.number(),
});
export type CreateListDto = z.infer<typeof createListDto>;
