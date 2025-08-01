import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
   out: './src/drizzle',
   schema: './src/drizzle/schema.ts',
   dialect: 'postgresql',
   verbose: true,
   dbCredentials: {
      url: process.env.DATABASE_URL!,
      ssl: false,
   },
})
