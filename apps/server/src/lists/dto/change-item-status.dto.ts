import { z } from 'zod';

import { itemStatus } from './create-item.dto';

export const changeItemStatusDto = z.object({
  itemId: z.number(),
  status: itemStatus,
});
export type ChangeItemStatusDto = z.infer<typeof changeItemStatusDto>;
