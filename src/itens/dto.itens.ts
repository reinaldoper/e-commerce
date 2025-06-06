import { z } from 'zod';

export const ItemSchema = z.object({
  orderId: z.number().int().positive().min(1),
  productId: z.number().int().positive().min(1),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(),
});

export const ItemId = z.object({
  id: z.number().int().positive().min(1),
});
