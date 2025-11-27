/**
 * Rate Limiting Middleware
 *
 * Protects API routes from abuse and DoS attacks.
 * Uses in-memory rate limiting that works per-instance in serverless.
 * Provides basic protection - entries are cleaned on each request.
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory rate limit store (per-instance in serverless)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Max entries to prevent memory bloat in long-running instances
const MAX_ENTRIES = 10000

/**
 * Clean expired entries from the store
 * Called on each request to prevent memory issues
 */
function cleanExpiredEntries(now: number) {
  if (rateLimitStore.size > MAX_ENTRIES) {
    // If we have too many entries, clear all expired ones
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
    // If still too many, clear oldest entries
    if (rateLimitStore.size > MAX_ENTRIES) {
      const entries = Array.from(rateLimitStore.entries())
      entries.sort((a, b) => a[1].resetAt - b[1].resetAt)
      const toRemove = entries.slice(0, rateLimitStore.size - MAX_ENTRIES / 2)
      toRemove.forEach(([key]) => rateLimitStore.delete(key))
    }
  }
}

interface RateLimitOptions {
  limit?: number // Number of requests allowed
  window?: number // Time window in seconds
}

/**
 * Rate limit middleware
 *
 * @param request - Next.js request object
 * @param options - Rate limit configuration
 * @returns Error response if rate limited, null if allowed
 */
export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): Promise<NextResponse | null> {
  const { limit = 10, window = 10 } = options

  // Get client identifier (IP address or user ID)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous'

  // Try to get user ID from auth if available
  let identifier = ip
  try {
    const { stackServerApp } = await import('@/lib/stack')
    const user = await stackServerApp.getUser()
    if (user) {
      identifier = `user:${user.id}`
    }
  } catch {
    // Auth not available, use IP
  }

  const now = Date.now()

  // Clean expired entries on each request
  cleanExpiredEntries(now)

  const resetAt = now + window * 1000
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetAt < now) {
    // New entry or expired, allow request
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    })
    return null
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${Math.ceil((entry.resetAt - now) / 1000)} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((entry.resetAt - now) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(entry.resetAt / 1000).toString(),
        },
      }
    )
  }

  // Increment counter
  entry.count++
  rateLimitStore.set(identifier, entry)

  return null
}

/**
 * Rate limit with custom limits per endpoint
 */
export function createRateLimiter(options: RateLimitOptions) {
  return (request: NextRequest) => rateLimit(request, options)
}

// Pre-configured rate limiters for common use cases
export const strictRateLimit = createRateLimiter({ limit: 5, window: 60 }) // 5 requests per minute
export const moderateRateLimit = createRateLimiter({ limit: 10, window: 10 }) // 10 requests per 10 seconds
export const lenientRateLimit = createRateLimiter({ limit: 100, window: 60 }) // 100 requests per minute
