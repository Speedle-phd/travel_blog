import { z } from 'zod'

const envSchema = z.object({
   DATABASE_URL: z.url(),
   NEXT_PUBLIC_STATIC: z.string().min(1, 'STATIC must be a non-empty string'),
   NEXT_PUBLIC_PASSWORD: z.string().min(1, 'PASSWORD must be a non-empty string'),
})

export const env = envSchema.parse(process.env)
