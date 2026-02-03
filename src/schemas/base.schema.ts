import { z } from 'zod';

export const baseModelSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BaseModel = z.infer<typeof baseModelSchema>;
