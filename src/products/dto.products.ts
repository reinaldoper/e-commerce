import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(50).optional(),
  image: z.string().url().optional(),
  rating: z
    .object({
      rate: z.number().positive(),
      count: z.number().int().nonnegative(),
    })
    .optional(),
});
