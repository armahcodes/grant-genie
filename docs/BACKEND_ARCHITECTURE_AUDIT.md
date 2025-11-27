# Backend Architecture Audit Report

**Date:** 2025-10-27  
**Scope:** API Routes, Database Schema, Infrastructure  
**Status:** 🔍 Complete  

---

## Executive Summary

The HeadspaceGenie.ai backend is well-structured with a comprehensive database schema using Drizzle ORM and PostgreSQL (Neon). However, there are critical security vulnerabilities, missing authentication middleware, lack of input validation, and no rate limiting. The application is currently using **MOCK DATA** in production which needs immediate attention.

### Critical Findings

🔴 **CRITICAL ISSUES (10)**
- No authentication middleware on API routes
- Missing input validation/sanitization
- No rate limiting
- Using mock data instead of real database
- Missing error logging/monitoring
- No API request validation
- Exposed sensitive operations
- Missing CORS configuration
- No request body size limits
- Missing database indexes

⚠️ **HIGH PRIORITY (8)**
- Missing pagination on all list endpoints
- No caching strategy
- Missing API versioning
- No request/response compression
- Missing database connection pooling
- No backup/restore strategy
- Missing API documentation
- No performance monitoring

---

## 1. Database Schema Analysis

### ✅ **Strengths**

1. **Comprehensive Schema Design**
   - 25 tables covering all application features
   - Well-organized into logical groups (grants, donors, compliance, etc.)
   - Proper foreign key relationships
   - Good use of JSONB for flexible data

2. **Proper Relations**
   - All tables have defined Drizzle relations
   - Foreign key constraints properly set
   - Cascade behavior implicit through relations

3. **Data Types**
   - Appropriate use of `decimal` for financial data
   - `timestamp` for all date fields with defaults
   - `jsonb` for complex/flexible data structures

4. **Audit Trail**
   - `createdAt` and `updatedAt` on all tables
   - Dedicated `activityLog` table for user actions
   - Good tracking of entity changes

### 🔴 **Critical Issues**

#### Issue 1.1: Missing Database Indexes
**Priority:** CRITICAL  
**Impact:** Severe performance degradation on queries

**Problem:**
```typescript
// No indexes defined in schema
export const grantApplications = pgTable('grant_applications', {
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status').notNull().default('Draft'),
  deadline: timestamp('deadline'),
  // ... no indexes!
})
```

**Queries that will be slow:**
- Filtering by `userId` (most common query)
- Filtering by `status`
- Sorting by `deadline`
- Filtering by date ranges

**Recommendation:**
```typescript
export const grantApplications = pgTable('grant_applications', {
  // ... existing fields
}, (table) => ({
  userIdIdx: index('grant_applications_user_id_idx').on(table.userId),
  statusIdx: index('grant_applications_status_idx').on(table.status),
  deadlineIdx: index('grant_applications_deadline_idx').on(table.deadline),
  createdAtIdx: index('grant_applications_created_at_idx').on(table.createdAt),
  // Composite index for common query pattern
  userStatusIdx: index('grant_applications_user_status_idx').on(table.userId, table.status),
}))
```

**Tables Needing Indexes:**
- `grantApplications`: userId, status, deadline
- `complianceItems`: userId, status, dueDate
- `donors`: userId, relationshipStatus
- `notifications`: userId, read, createdAt
- `grantOpportunities`: category, status, deadline
- `documents`: userId, entityType, entityId
- `activityLog`: userId, createdAt, entityType

---

#### Issue 1.2: Missing Unique Constraints
**Priority:** HIGH  
**Impact:** Duplicate data, data integrity issues

**Problem:**
```typescript
export const grantBookmarks = pgTable('grant_bookmarks', {
  userId: text('user_id').notNull().references(() => users.id),
  grantOpportunityId: integer('grant_opportunity_id').notNull().references(() => grantOpportunities.id),
  // User can bookmark same grant multiple times!
})
```

**Recommendation:**
```typescript
export const grantBookmarks = pgTable('grant_bookmarks', {
  // ... fields
}, (table) => ({
  uniqueUserGrant: unique().on(table.userId, table.grantOpportunityId),
}))
```

**Tables Needing Unique Constraints:**
- `grantBookmarks`: (userId, grantOpportunityId)
- `savedSearches`: (userId, name)
- `teamMembers`: (userId, memberUserId)

---

#### Issue 1.3: Missing Default Values
**Priority:** MEDIUM  
**Impact:** Null values where defaults expected

**Problem:**
```typescript
export const grantApplications = pgTable('grant_applications', {
  status: text('status').notNull().default('Draft'),
  // But many fields that should have defaults don't:
  progress: integer('progress'), // Should default to 0
  // Missing audit timestamps on updates
})
```

**Recommendation:**
Add defaults and update triggers:
```typescript
progress: integer('progress').default(0),
// Add trigger for updatedAt in migration:
CREATE TRIGGER update_grant_applications_updated_at
  BEFORE UPDATE ON grant_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

#### Issue 1.4: Weak Foreign Key Handling
**Priority:** MEDIUM  
**Impact:** Orphaned records

**Problem:**
```typescript
export const complianceItems = pgTable('compliance_items', {
  grantId: integer('grant_id').references(() => grantApplications.id),
  // No ON DELETE behavior specified
  // What happens when grant is deleted?
})
```

**Recommendation:**
```typescript
grantId: integer('grant_id')
  .references(() => grantApplications.id, { onDelete: 'cascade' }),
```

**Cascade Rules Needed:**
- Delete user → cascade to all user's data
- Delete grant → cascade to compliance items, budgets, milestones
- Delete donor → cascade to interactions, meeting sessions

---

### ⚠️ **Schema Design Improvements**

#### Issue 1.5: Text Fields for Enums
**Priority:** LOW  
**Impact:** No type safety, potential invalid data

**Current:**
```typescript
status: text('status').default('Draft')
// Allows ANY string value
```

**Better:**
```typescript
import { pgEnum } from 'drizzle-orm/pg-core'

export const grantStatusEnum = pgEnum('grant_status', [
  'Draft',
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected'
])

export const grantApplications = pgTable('grant_applications', {
  status: grantStatusEnum('status').default('Draft'),
})
```

**Enums Needed:**
- Grant status
- Compliance status
- Priority levels
- Notification types
- Donor relationship status
- Report types

---

## 2. API Routes Analysis

### 🔴 **Critical Security Issues**

#### Issue 2.1: No Authentication Middleware
**Priority:** CRITICAL  
**Impact:** ANYONE can access/modify ANY user's data

**Current State:**
```typescript
// app/api/grants/route.ts
export async function GET(request: NextRequest) {
  const userId = searchParams.get('userId') // From URL!
  
  const grants = await db
    .select()
    .from(grantApplications)
    .where(eq(grantApplications.userId, userId))
  // Returns grants for ANY userId passed in URL
}
```

**Attack Vector:**
```bash
# Attacker can access any user's grants
curl https://app.com/api/grants?userId=victim-user-id

# Or modify them
curl -X POST https://app.com/api/grants \
  -d '{"userId":"victim-id","grantTitle":"Malicious"}'
```

**IMMEDIATE FIX REQUIRED:**
```typescript
import { getUser } from '@stackframe/stack'

export async function GET(request: NextRequest) {
  // Get AUTHENTICATED user from Stack Auth
  const user = await getUser(request)
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use authenticated user's ID, NOT query parameter
  const grants = await db
    .select()
    .from(grantApplications)
    .where(eq(grantApplications.userId, user.id))
    
  return NextResponse.json({ grants })
}
```

**ALL API routes affected:**
- `/api/grants` ❌
- `/api/grant-opportunities` ❌ (partially)
- `/api/compliance` ❌
- `/api/donors` ❌
- `/api/documents` ❌
- `/api/notifications` ❌
- `/api/bookmarks` ❌
- `/api/dashboard/stats` ❌

---

#### Issue 2.2: No Input Validation
**Priority:** CRITICAL  
**Impact:** SQL injection, XSS, invalid data in database

**Current:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, grantTitle, organization, ... } = body
  
  // Directly inserts user input into database!
  await db.insert(grantApplications).values({
    userId, // Could be malicious
    grantTitle, // Could contain XSS
    organization, // Not validated
  })
}
```

**Recommendation - Use Zod:**
```typescript
import { z } from 'zod'

const createGrantSchema = z.object({
  grantTitle: z.string().min(1).max(500).trim(),
  organization: z.string().min(1).max(200).trim(),
  funderName: z.string().min(1).max(200).trim(),
  amount: z.string().regex(/^\$[\d,]+$/).optional(),
  deadline: z.string().datetime().optional(),
  focusArea: z.string().max(100).optional(),
})

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return unauthorized()
  
  const body = await request.json()
  
  // Validate input
  const validation = createGrantSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({
      error: 'Invalid input',
      details: validation.error.errors
    }, { status: 400 })
  }
  
  const data = validation.data
  
  // Now safe to insert
  await db.insert(grantApplications).values({
    userId: user.id,
    ...data
  })
}
```

---

#### Issue 2.3: No Rate Limiting
**Priority:** CRITICAL  
**Impact:** DDoS attacks, resource exhaustion

**Current:** No rate limiting on any endpoint

**Attack Scenario:**
```bash
# Attacker can spam API
while true; do
  curl https://app.com/api/grants
done
# Overwhelms database, crashes app
```

**Recommendation - Add Rate Limiting Middleware:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
})

export async function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }
  
  return null
}

// Use in routes:
export async function GET(request: NextRequest) {
  const rateLimitError = await rateLimit(request)
  if (rateLimitError) return rateLimitError
  
  // ... rest of handler
}
```

---

#### Issue 2.4: Missing Error Handling
**Priority:** HIGH  
**Impact:** Information disclosure, poor UX

**Current:**
```typescript
export async function GET(request: NextRequest) {
  try {
    // ... code
  } catch (error) {
    console.error('Error fetching grants:', error)
    // Exposes internal error details
    return NextResponse.json({ error: 'Failed to fetch grants' }, { status: 500 })
  }
}
```

**Problems:**
- Generic error messages
- No error logging service
- No error tracking
- Stack traces potentially exposed in dev mode

**Recommendation:**
```typescript
import * as Sentry from '@sentry/nextjs'

export async function GET(request: NextRequest) {
  try {
    // ... code
  } catch (error) {
    // Log to error tracking service
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/grants',
        method: 'GET',
      },
      user: { id: user?.id },
    })
    
    // Don't expose internal errors
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: 'Database temporarily unavailable' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
```

---

### ⚠️ **API Design Issues**

#### Issue 2.5: Missing Pagination
**Priority:** HIGH  
**Impact:** Performance, memory exhaustion

**Current:**
```typescript
// Returns ALL grants for user
const grants = await db
  .select()
  .from(grantApplications)
  .where(eq(grantApplications.userId, userId))
  .orderBy(desc(grantApplications.createdAt))
// Could return 10,000+ records!
```

**Recommendation:**
```typescript
const page = parseInt(searchParams.get('page') || '1')
const limit = parseInt(searchParams.get('limit') || '20')
const offset = (page - 1) * limit

const grants = await db
  .select()
  .from(grantApplications)
  .where(eq(grantApplications.userId, user.id))
  .orderBy(desc(grantApplications.createdAt))
  .limit(Math.min(limit, 100)) // Cap at 100
  .offset(offset)

const total = await db
  .select({ count: count() })
  .from(grantApplications)
  .where(eq(grantApplications.userId, user.id))

return NextResponse.json({
  grants,
  pagination: {
    page,
    limit,
    total: total[0].count,
    totalPages: Math.ceil(total[0].count / limit)
  }
})
```

---

#### Issue 2.6: No API Versioning
**Priority:** MEDIUM  
**Impact:** Breaking changes affect all clients

**Current:** `/api/grants`

**Recommendation:**
```
/api/v1/grants
/api/v2/grants (when changes needed)
```

Structure:
```
app/
  api/
    v1/
      grants/
        route.ts
      donors/
        route.ts
```

---

#### Issue 2.7: Inefficient Queries
**Priority:** HIGH  
**Impact:** Slow response times, high database load

**Current:**
```typescript
// N+1 query problem in mockData
// If we implemented real data fetching:
const grants = await db.select().from(grantApplications)
for (const grant of grants) {
  grant.compliance = await db.select()
    .from(complianceItems)
    .where(eq(complianceItems.grantId, grant.id))
  // 1 query + N queries = N+1 problem
}
```

**Recommendation - Use Joins:**
```typescript
const grants = await db
  .select({
    grant: grantApplications,
    compliance: complianceItems,
  })
  .from(grantApplications)
  .leftJoin(
    complianceItems,
    eq(grantApplications.id, complianceItems.grantId)
  )
  .where(eq(grantApplications.userId, user.id))
// Single query!
```

---

## 3. Infrastructure & Configuration

### 🔴 **Critical Issues**

#### Issue 3.1: Database Connection Not Optimized
**Priority:** HIGH  
**Impact:** Connection exhaustion, slow queries

**Current:**
```typescript
// db/index.ts
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

**Problems:**
- No connection pooling configuration
- No connection timeout settings
- No retry logic
- Single connection instance

**Recommendation:**
```typescript
import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Configure Neon
neonConfig.fetchConnectionCache = true

const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: 'no-store', // Prevent caching for dynamic queries
  },
})

export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === 'development',
})
```

---

#### Issue 3.2: Missing Environment Variable Validation
**Priority:** HIGH  
**Impact:** Runtime crashes, security issues

**Current:**
```typescript
const sql = neon(process.env.DATABASE_URL!)
// Assumes DATABASE_URL exists, crashes if not
```

**Recommendation:**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1),
  STACK_SECRET_SERVER_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const env = envSchema.parse(process.env)

export default env
```

---

#### Issue 3.3: No Database Migrations Strategy
**Priority:** MEDIUM  
**Impact:** Schema drift, deployment issues

**Current:**
```bash
"db:generate": "drizzle-kit generate"
"db:migrate": "tsx db/migrate.ts"
```

**Missing:**
- Migration rollback capability
- Migration history tracking
- Automated migration on deploy
- Seed data management

**Recommendation:**
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts",
    "db:reset": "tsx db/reset.ts"
  }
}
```

Create migration runner:
```typescript
// db/migrate.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  console.log('Running migrations...')
  
  await migrate(db, {
    migrationsFolder: './db/migrations',
  })
  
  console.log('Migrations complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
```

---

## 4. Mock Data vs Real Database

### 🔴 **CRITICAL: Application Using Mock Data**

**Current State:**
```typescript
// lib/mockData.ts - 454 lines of mock data
export const mockGrants: Grant[] = [...]
export const mockApplications: Application[] = [...]
export const mockCompliance: ComplianceItem[] = [...]

// Used throughout application:
import { mockApplications } from '@/lib/mockData'
```

**Problem:**
- ❌ NO real data persistence
- ❌ Changes not saved to database
- ❌ Data resets on page refresh
- ❌ No multi-user support
- ❌ Cannot scale

**Files Using Mock Data:**
- `app/dashboard/page.tsx`
- `app/grant-search/page.tsx`
- `app/compliance-tracker/page.tsx`
- Multiple other pages

**IMMEDIATE ACTION REQUIRED:**
Replace mock data with real API calls:

```typescript
// Instead of:
import { mockApplications } from '@/lib/mockData'

// Do:
const { data: applications } = await fetch('/api/grants?userId=' + user.id)
```

---

## 5. Missing Features

### API Features Not Implemented

1. **Search & Filtering**
   - ❌ Full-text search
   - ❌ Advanced filters
   - ❌ Sorting options
   - ❌ Saved searches execution

2. **File Upload**
   - ✅ Blob storage configured
   - ❌ File upload endpoint implementation
   - ❌ File validation (size, type)
   - ❌ Virus scanning

3. **Notifications**
   - ❌ Email notifications
   - ❌ Push notifications
   - ❌ Notification preferences
   - ❌ Real-time updates

4. **Reports**
   - ❌ Grant report generation
   - ❌ Analytics endpoints
   - ❌ Export functionality
   - ❌ PDF generation

5. **AI Integration**
   - ✅ Mastra AI configured
   - ❌ Grant writing endpoint
   - ❌ Donor practice endpoint
   - ❌ AI suggestions API

---

## 6. Recommendations

### Immediate (Week 1)

1. **Add Authentication Middleware**
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   import { getUser } from '@stackframe/stack'
   
   export async function middleware(request: NextRequest) {
     // Protect all /api routes
     if (request.nextUrl.pathname.startsWith('/api')) {
       const user = await getUser(request)
       
       if (!user) {
         return NextResponse.json(
           { error: 'Unauthorized' },
           { status: 401 }
         )
       }
       
       // Add user to request context
       const requestHeaders = new Headers(request.headers)
       requestHeaders.set('x-user-id', user.id)
       
       return NextResponse.next({
         request: {
           headers: requestHeaders,
         },
       })
     }
   }
   
   export const config = {
     matcher: '/api/:path*',
   }
   ```

2. **Add Input Validation**
   - Install: `npm install zod`
   - Create validation schemas for all endpoints
   - Validate all user input before database operations

3. **Add Database Indexes**
   - Create migration with indexes
   - Apply to production database
   - Monitor query performance

4. **Replace Mock Data**
   - Implement real API calls
   - Remove mock data imports
   - Test with real database

### Short Term (Month 1)

5. **Add Rate Limiting**
   - Install: `npm install @upstash/ratelimit @upstash/redis`
   - Configure rate limits per endpoint
   - Add rate limit headers

6. **Implement Error Tracking**
   - Install: `npm install @sentry/nextjs`
   - Configure Sentry
   - Add error boundaries

7. **Add Pagination**
   - Implement on all list endpoints
   - Add page/limit parameters
   - Return total count

8. **Optimize Database**
   - Add composite indexes
   - Add unique constraints
   - Implement connection pooling

### Medium Term (Quarter 1)

9. **API Documentation**
   - Generate OpenAPI/Swagger docs
   - Document all endpoints
   - Add example requests/responses

10. **Caching Strategy**
    - Implement Redis caching
    - Cache frequently accessed data
    - Set appropriate TTLs

11. **Monitoring & Logging**
    - Add application monitoring (Datadog/New Relic)
    - Implement structured logging
    - Set up alerts

12. **Testing**
    - Unit tests for API routes
    - Integration tests for database
    - End-to-end tests

---

## 7. Security Checklist

- [ ] Add authentication middleware to all API routes
- [ ] Implement request validation with Zod
- [ ] Add rate limiting to prevent abuse
- [ ] Sanitize all user inputs
- [ ] Add CORS configuration
- [ ] Implement CSRF protection
- [ ] Add request size limits
- [ ] Enable HTTPS only
- [ ] Add security headers
- [ ] Implement audit logging
- [ ] Add SQL injection prevention (Drizzle handles this)
- [ ] Validate file uploads
- [ ] Add API key rotation
- [ ] Implement IP whitelisting for admin endpoints
- [ ] Add honeypot fields in forms

---

## 8. Performance Checklist

- [ ] Add database indexes
- [ ] Implement connection pooling
- [ ] Add query result caching
- [ ] Implement pagination
- [ ] Optimize N+1 queries
- [ ] Add database query logging
- [ ] Implement lazy loading
- [ ] Add CDN for static assets
- [ ] Enable gzip compression
- [ ] Add response caching headers
- [ ] Implement background jobs for heavy operations
- [ ] Add database read replicas for scaling

---

## Summary

### Health Score: 45/100

| Category | Score | Status |
|----------|-------|--------|
| Security | 20/100 | 🔴 Critical |
| Performance | 50/100 | ⚠️ Needs Work |
| Scalability | 40/100 | ⚠️ Needs Work |
| Data Integrity | 60/100 | ⚠️ Needs Work |
| Code Quality | 70/100 | ✅ Good |

### Estimated Effort

- **Critical Fixes**: 2-3 weeks
- **High Priority**: 1 month
- **Medium Priority**: 1 quarter
- **Total**: 3-4 months for production-ready

---

**Status:** 📋 Audit Complete - Immediate Action Required  
**Next Step:** Implement authentication middleware and input validation  
**Priority:** Address 10 critical security issues before launch