import { config } from 'dotenv'
import { resolve } from 'path'

// Load test environment variables
config({ path: resolve(process.cwd(), '.env.test') })
config({ path: resolve(process.cwd(), '.env.local') })

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
}

console.log('Test environment loaded successfully')