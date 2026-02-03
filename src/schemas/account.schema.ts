import { z } from 'zod';
import { baseModelSchema } from './base.schema';

export const ScopeEnum = z.enum(['account', 'prospect', 'child']);

export const accountPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  scope: ScopeEnum,
}).strict('Only name and scope are allowed');

export type AccountPayload = z.infer<typeof accountPayloadSchema>;

export const accountSchema = accountPayloadSchema.merge(baseModelSchema).extend({
  _id: z.any().optional(),
});

export type Account = z.infer<typeof accountSchema>;
