import { z } from 'zod';

export const ItemSchema = z.object({
  orderId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});
