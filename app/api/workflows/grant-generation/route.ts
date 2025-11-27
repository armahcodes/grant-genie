/**
 * Grant Generation Workflow API Route
 *
 * Triggers the durable workflow for generating grant proposals.
 * Uses Vercel Workflows for reliability and observability.
 */

import { NextRequest, NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { grantGenerationWorkflow } from '@/lib/workflows/grant-generation'
import { requireAuth } from '@/lib/middleware/auth'
import { moderateRateLimit } from '@/lib/middleware/rate-limit'
import { successResponse, errorResponse } from '@/lib/api/response'
import { z } from 'zod'

// Input validation schema
const grantGenerationSchema = z.object({
  grantId: z.number().int().positive(),
  projectName: z.string().min(1).max(500),
  funderName: z.string().min(1).max(300),
  fundingAmount: z.string().optional(),
  deadline: z.string().optional(),
  rfpText: z.string().optional(),
  teachingMaterials: z.string().optional(),
})

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

    const validationResult = grantGenerationSchema.safeParse(body)
    if (!validationResult.success) {
      return errorResponse(
        'Invalid request data',
        400,
        validationResult.error.issues
      )
    }

    const { grantId, projectName, funderName, fundingAmount, deadline, rfpText, teachingMaterials } = validationResult.data

    // Start the workflow
    await start(grantGenerationWorkflow, [{
      grantId,
      userId: user!.id,
      projectName,
      funderName,
      fundingAmount,
      deadline,
      rfpText,
      teachingMaterials,
    }])

    return NextResponse.json(
      successResponse({
        message: 'Grant generation workflow started',
        grantId,
      }),
      { status: 202 }
    )
  } catch (error) {
    console.error('Error starting grant generation workflow:', error)
    return errorResponse('Failed to start grant generation workflow', 500)
  }
}
