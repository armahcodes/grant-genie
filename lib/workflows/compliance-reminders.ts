/**
 * Compliance Reminders Workflow
 *
 * Durable workflow for sending compliance deadline reminders.
 * Uses Vercel Workflows for scheduled, reliable execution.
 */

import { sleep } from 'workflow'

// Step: Find upcoming deadlines
async function findUpcomingDeadlines(daysAhead: number) {
  'use step'

  const { db } = await import('@/db')
  const { complianceItems } = await import('@/db/schema')
  const { eq, and, lte, gte } = await import('drizzle-orm')

  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysAhead)

  const upcomingItems = await db
    .select()
    .from(complianceItems)
    .where(
      and(
        eq(complianceItems.status, 'Upcoming'),
        gte(complianceItems.dueDate, now),
        lte(complianceItems.dueDate, futureDate)
      )
    )

  return upcomingItems
}

// Step: Send reminder notification
async function sendReminderNotification(
  userId: string,
  itemRequirement: string,
  dueDate: Date,
  itemId: number
) {
  'use step'

  const { db } = await import('@/db')
  const { notifications } = await import('@/db/schema')

  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  await db.insert(notifications).values({
    userId,
    type: 'reminder',
    title: 'Compliance Deadline Approaching',
    message: `"${itemRequirement}" is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}. Don't forget to complete it!`,
    read: false,
    actionUrl: `/compliance-tracker?highlight=${itemId}`,
  })

  return { success: true, itemId }
}

/**
 * Daily Compliance Check Workflow
 *
 * Runs daily to check for upcoming compliance deadlines
 * and sends reminders to users.
 */
export async function dailyComplianceCheckWorkflow() {
  'use workflow'

  // Find items due in the next 7 days
  const upcomingItems = await findUpcomingDeadlines(7)

  const results = []

  for (const item of upcomingItems) {
    // Send reminder for each upcoming item
    const result = await sendReminderNotification(
      item.userId,
      item.requirement,
      item.dueDate,
      item.id
    )
    results.push(result)
  }

  return {
    success: true,
    remindersSet: results.length,
    items: results,
  }
}

/**
 * Single Item Reminder Workflow
 *
 * Sets up reminders for a specific compliance item.
 * Sends reminders at 7 days, 3 days, and 1 day before deadline.
 */
export async function itemReminderWorkflow(input: {
  userId: string
  itemId: number
  itemRequirement: string
  dueDate: Date
}) {
  'use workflow'

  const { userId, itemId, itemRequirement, dueDate } = input
  const now = new Date()
  const msUntilDue = dueDate.getTime() - now.getTime()
  const daysUntilDue = msUntilDue / (1000 * 60 * 60 * 24)

  // Send 7-day reminder if applicable
  if (daysUntilDue > 7) {
    const waitTime = msUntilDue - 7 * 24 * 60 * 60 * 1000
    await sleep(`${Math.floor(waitTime / 1000)} seconds`)
    await sendReminderNotification(userId, itemRequirement, dueDate, itemId)
  }

  // Send 3-day reminder if applicable
  if (daysUntilDue > 3) {
    const waitTime = msUntilDue - 3 * 24 * 60 * 60 * 1000
    await sleep(`${Math.floor(waitTime / 1000)} seconds`)
    await sendReminderNotification(userId, itemRequirement, dueDate, itemId)
  }

  // Send 1-day reminder if applicable
  if (daysUntilDue > 1) {
    const waitTime = msUntilDue - 1 * 24 * 60 * 60 * 1000
    await sleep(`${Math.floor(waitTime / 1000)} seconds`)
    await sendReminderNotification(userId, itemRequirement, dueDate, itemId)
  }

  return {
    success: true,
    itemId,
    remindersSent: true,
  }
}
