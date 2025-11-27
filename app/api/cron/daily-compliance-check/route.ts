/**
 * Daily Compliance Check Cron Job
 *
 * Triggered by Vercel Cron at 8 AM UTC daily.
 * Starts the compliance reminders workflow.
 */

import { NextRequest, NextResponse } from 'next/server'
import { start } from 'workflow/api'
import { dailyComplianceCheckWorkflow } from '@/lib/workflows/compliance-reminders'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel sends this header)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Start the daily compliance check workflow
    await start(dailyComplianceCheckWorkflow, [])

    return NextResponse.json({
      success: true,
      message: 'Daily compliance check workflow started',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in daily compliance check cron:', error)
    return NextResponse.json(
      { error: 'Failed to start compliance check workflow' },
      { status: 500 }
    )
  }
}
