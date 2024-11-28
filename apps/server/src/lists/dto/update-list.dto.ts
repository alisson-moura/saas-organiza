import { z } from 'zod';
import { createListDto } from './create-list.dto';

export const updateListDto = z
  .object({
    id: z.number(),
  })
  .merge(createListDto);
export type UpdateListDto = z.infer<typeof updateListDto>;
