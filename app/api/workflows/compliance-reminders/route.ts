/**
 * Compliance Reminders Workflow API Route
 *
 * Triggers the durable workflow for compliance deadline reminders.
 * Uses Vercel Workflows for scheduled, reliable execution.
 */

import { NextRequest, NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { dailyComplianceCheckWorkflow, itemReminderWorkflow } from '@/lib/workflows/compliance-reminders'
import { requireAuth } from '@/lib/middleware/auth'
import { moderateRateLimit } from '@/lib/middleware/rate-limit'
import { successResponse, errorResponse } from '@/lib/api/response'
import { z } from 'zod'

// Input validation schema for item-specific reminders
const itemReminderSchema = z.object({
  itemId: z.number().int().positive(),
  itemRequirement: z.string().min(1).max(500),
  dueDate: z.string().datetime(),
})

// POST /api/workflows/compliance-reminders - Trigger daily check or item-specific reminder
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitError = await moderateRateLimit(request)
    if (rateLimitError) return rateLimitError

    // Authenticate user
    const { error, user } = await requireAuth(request)
    if (error) return error

    // Parse request body (optional - if empty, run daily check)
    let body: Record<string, unknown> = {}
    try {
      const text = await request.text()
      if (text) {
        body = JSON.parse(text)
      }
    } catch {
      return errorResponse('Invalid JSON in request body', 400)
    }

    // Check if this is an item-specific reminder or daily check
    if (body.itemId) {
      // Validate item-specific input
      const validationResult = itemReminderSchema.safeParse(body)
      if (!validationResult.success) {
        return errorResponse(
          'Invalid request data',
          400,
          validationResult.error.issues
        )
      }

      const { itemId, itemRequirement, dueDate } = validationResult.data

      // Start the item reminder workflow
      await start(itemReminderWorkflow, [{
        userId: user!.id,
        itemId,
        itemRequirement,
        dueDate: new Date(dueDate),
      }])

      return NextResponse.json(
        successResponse({
          message: 'Item reminder workflow started',
          itemId,
        }),
        { status: 202 }
      )
    } else {
      // Run daily compliance check
      await start(dailyComplianceCheckWorkflow, [])

      return NextResponse.json(
        successResponse({
          message: 'Daily compliance check workflow started',
        }),
        { status: 202 }
      )
    }
  } catch (error) {
    console.error('Error starting compliance reminders workflow:', error)
    return errorResponse('Failed to start compliance reminders workflow', 500)
  }
}
