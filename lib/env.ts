import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(20),
  ADMIN_AUTH_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
