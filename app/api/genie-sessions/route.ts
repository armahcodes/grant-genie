import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { genieSessions, genieExecutions, activityLog } from '@/db/schema'
import { desc, eq, count, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/middleware/auth'
import { moderateRateLimit } from '@/lib/middleware/rate-limit'
import { successResponse, errorResponse } from '@/lib/api/response'
import { paginationSchema, createGenieSessionSchema } from '@/lib/validation/zod-schemas'

// GET /api/genie-sessions - List all genie sessions for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    // Validate pagination parameters
    const searchParams = request.nextUrl.searchParams
    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    })

    if (!paginationResult.success) {
      return errorResponse(
        'Invalid pagination parameters',
        400,
        paginationResult.error.issues
      )
    }

    const { page, limit } = paginationResult.data
    const offset = (page - 1) * limit

    // Optional filter by genie type
    const genieType = searchParams.get('genieType')
    const status = searchParams.get('status')

    // Build where conditions
    const conditions = [eq(genieSessions.userId, user!.id)]
    if (genieType) {
      conditions.push(eq(genieSessions.genieType, genieType))
    }
    if (status) {
      conditions.push(eq(genieSessions.status, status))
    }

    // Fetch sessions for authenticated user
    const sessions = await db
      .select()
      .from(genieSessions)
      .where(and(...conditions))
      .orderBy(desc(genieSessions.updatedAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(genieSessions)
      .where(and(...conditions))

    const total = totalResult.count

    return NextResponse.json(
      successResponse(sessions, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    )
  } catch (error) {
    console.error('Error fetching genie sessions:', error)
    return errorResponse('An unexpected error occurred while fetching genie sessions', 500)
  }
}

// POST /api/genie-sessions - Create a new genie session
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON in request body', 400)
    }

    // Validate request body against schema
    const validationResult = createGenieSessionSchema.safeParse(body)

    if (!validationResult.success) {
      return errorResponse(
        'Invalid request data',
        400,
        validationResult.error.issues
      )
    }

    const validatedData = validationResult.data

    // Create the session and log activity in a transaction
    const newSession = await db.transaction(async (tx) => {
      // Create the genie session
      const [session] = await tx
        .insert(genieSessions)
        .values({
          userId: user!.id,
          name: validatedData.name.trim(),
          genieType: validatedData.genieType,
          status: 'draft',
          config: validatedData.config || {},
          inputData: validatedData.inputData || null,
          grantApplicationId: validatedData.grantApplicationId || null,
          donorId: validatedData.donorId || null,
        })
        .returning()

      // Log the activity
      await tx.insert(activityLog).values({
        userId: user!.id,
        action: `Created new ${validatedData.genieType.replace('_', ' ')} session: ${validatedData.name}`,
        entityType: 'genie_session',
        entityId: session.id,
        details: `Genie type: ${validatedData.genieType}`,
      })

      return session
    })

    return NextResponse.json(successResponse(newSession), { status: 201 })
  } catch (error) {
    console.error('Error creating genie session:', error)
    return errorResponse('An unexpected error occurred while creating the genie session', 500)
  }
}
