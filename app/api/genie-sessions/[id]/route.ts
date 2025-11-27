import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { genieSessions, genieExecutions, activityLog } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/middleware/auth'
import { moderateRateLimit } from '@/lib/middleware/rate-limit'
import { successResponse, errorResponse } from '@/lib/api/response'
import { updateGenieSessionSchema, genieExecutionSchema } from '@/lib/validation/zod-schemas'

// GET /api/genie-sessions/[id] - Get a single genie session with executions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    const { id } = await params
    const sessionId = parseInt(id, 10)

    if (isNaN(sessionId)) {
      return errorResponse('Invalid session ID', 400)
    }

    // Fetch the session (only if owned by user)
    const [session] = await db
      .select()
      .from(genieSessions)
      .where(
        and(
          eq(genieSessions.id, sessionId),
          eq(genieSessions.userId, user!.id)
        )
      )

    if (!session) {
      return errorResponse('Genie session not found', 404)
    }

    // Fetch execution history
    const executions = await db
      .select()
      .from(genieExecutions)
      .where(eq(genieExecutions.sessionId, sessionId))
      .orderBy(desc(genieExecutions.executionNumber))

    return NextResponse.json(
      successResponse({
        ...session,
        executions,
      })
    )
  } catch (error) {
    console.error('Error fetching genie session:', error)
    return errorResponse('An unexpected error occurred while fetching the genie session', 500)
  }
}

// PATCH /api/genie-sessions/[id] - Update a genie session
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    const { id } = await params
    const sessionId = parseInt(id, 10)

    if (isNaN(sessionId)) {
      return errorResponse('Invalid session ID', 400)
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return errorResponse('Invalid JSON in request body', 400)
    }

    // Check for execution logging
    const logExecution = body.logExecution === true
    delete body.logExecution

    const validationResult = updateGenieSessionSchema.safeParse(body)

    if (!validationResult.success) {
      return errorResponse(
        'Invalid request data',
        400,
        validationResult.error.issues
      )
    }

    const validatedData = validationResult.data

    // Update the session in a transaction
    const updatedSession = await db.transaction(async (tx) => {
      // First verify ownership
      const [existingSession] = await tx
        .select()
        .from(genieSessions)
        .where(
          and(
            eq(genieSessions.id, sessionId),
            eq(genieSessions.userId, user!.id)
          )
        )

      if (!existingSession) {
        throw new Error('NOT_FOUND')
      }

      // Build update object
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      if (validatedData.name !== undefined) {
        updateData.name = validatedData.name.trim()
      }
      if (validatedData.status !== undefined) {
        updateData.status = validatedData.status
      }
      if (validatedData.config !== undefined) {
        updateData.config = validatedData.config
      }
      if (validatedData.inputData !== undefined) {
        updateData.inputData = validatedData.inputData
      }
      if (validatedData.outputContent !== undefined) {
        updateData.outputContent = validatedData.outputContent
      }
      if (validatedData.outputMetadata !== undefined) {
        updateData.outputMetadata = validatedData.outputMetadata
      }
      if (validatedData.conversationHistory !== undefined) {
        updateData.conversationHistory = validatedData.conversationHistory
      }
      if (validatedData.grantApplicationId !== undefined) {
        updateData.grantApplicationId = validatedData.grantApplicationId
      }
      if (validatedData.donorId !== undefined) {
        updateData.donorId = validatedData.donorId
      }

      // If logging execution, increment count and set last executed
      if (logExecution) {
        updateData.executionCount = (existingSession.executionCount || 0) + 1
        updateData.lastExecutedAt = new Date()

        // Log the execution
        await tx.insert(genieExecutions).values({
          sessionId: sessionId,
          executionNumber: (existingSession.executionCount || 0) + 1,
          inputSnapshot: validatedData.inputData || existingSession.inputData,
          outputSnapshot: validatedData.outputContent || existingSession.outputContent,
          status: 'success',
          startedAt: new Date(),
          completedAt: new Date(),
        })
      }

      // Update the session
      const [session] = await tx
        .update(genieSessions)
        .set(updateData)
        .where(eq(genieSessions.id, sessionId))
        .returning()

      return session
    })

    return NextResponse.json(successResponse(updatedSession))
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return errorResponse('Genie session not found', 404)
    }
    console.error('Error updating genie session:', error)
    return errorResponse('An unexpected error occurred while updating the genie session', 500)
  }
}

// DELETE /api/genie-sessions/[id] - Delete (archive) a genie session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    const { id } = await params
    const sessionId = parseInt(id, 10)

    if (isNaN(sessionId)) {
      return errorResponse('Invalid session ID', 400)
    }

    // Check for permanent deletion flag
    const searchParams = request.nextUrl.searchParams
    const permanent = searchParams.get('permanent') === 'true'

    // Delete or archive in a transaction
    await db.transaction(async (tx) => {
      // First verify ownership
      const [existingSession] = await tx
        .select()
        .from(genieSessions)
        .where(
          and(
            eq(genieSessions.id, sessionId),
            eq(genieSessions.userId, user!.id)
          )
        )

      if (!existingSession) {
        throw new Error('NOT_FOUND')
      }

      if (permanent) {
        // Permanently delete (cascades to executions)
        await tx
          .delete(genieSessions)
          .where(eq(genieSessions.id, sessionId))

        // Log the activity
        await tx.insert(activityLog).values({
          userId: user!.id,
          action: `Permanently deleted ${existingSession.genieType.replace('_', ' ')} session: ${existingSession.name}`,
          entityType: 'genie_session',
          entityId: sessionId,
          details: 'Permanently deleted',
        })
      } else {
        // Soft delete (archive)
        await tx
          .update(genieSessions)
          .set({
            status: 'archived',
            updatedAt: new Date(),
          })
          .where(eq(genieSessions.id, sessionId))

        // Log the activity
        await tx.insert(activityLog).values({
          userId: user!.id,
          action: `Archived ${existingSession.genieType.replace('_', ' ')} session: ${existingSession.name}`,
          entityType: 'genie_session',
          entityId: sessionId,
          details: 'Archived',
        })
      }
    })

    return NextResponse.json(
      successResponse({ success: true, archived: !permanent })
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return errorResponse('Genie session not found', 404)
    }
    console.error('Error deleting genie session:', error)
    return errorResponse('An unexpected error occurred while deleting the genie session', 500)
  }
}
