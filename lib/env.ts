/**
 * Environment Variables Validation
 * 
 * Validates all required environment variables at startup
 * Prevents runtime crashes from missing configuration
 */

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // Stack Auth
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, 'NEXT_PUBLIC_STACK_PROJECT_ID is required'),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1, 'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required'),
  STACK_SECRET_SERVER_KEY: z.string().min(1, 'STACK_SECRET_SERVER_KEY is required'),
  
  // Vercel AI Gateway
  AI_GATEWAY_API_KEY: z.string().min(1, 'AI_GATEWAY_API_KEY is required'),

  // Vercel Blob (optional)
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Optional API URL
  NEXT_PUBLIC_API_URL: z.string().url().optional().or(z.literal('')),

  // Optional App URL (for server-side prefetching)
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal('')),

  // Vercel Cron Secret (for scheduled jobs)
  CRON_SECRET: z.string().optional(),
})

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }))
      
      console.error('❌ Invalid environment variables:')
      missingVars.forEach(({ path, message }) => {
        console.error(`  - ${path}: ${message}`)
      })
      
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars.map(v => `  - ${v.path}: ${v.message}`).join('\n')}\n\nPlease check your .env.local file.`
      )
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type-safe environment variable access
export default env

