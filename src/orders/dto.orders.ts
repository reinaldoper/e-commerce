import { z } from 'zod';

export const OrderSchema = z.object({
  userId: z.number().int().positive(),
});
