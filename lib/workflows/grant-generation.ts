/**
 * Grant Generation Workflow
 *
 * Durable workflow for generating grant proposals using AI.
 * Uses Vercel Workflows for reliability and observability.
 */

import { sleep } from 'workflow'

// Step: Generate the grant proposal content
async function generateProposalContent(
  projectName: string,
  funderName: string,
  fundingAmount?: string,
  deadline?: string,
  rfpText?: string,
  teachingMaterials?: string
) {
  'use step'

  const { mastra } = await import('@/lib/mastra')

  const prompt = `Generate a comprehensive grant proposal for the following project:

Project Name: ${projectName}
Funder: ${funderName}
${fundingAmount ? `Funding Amount Requested: ${fundingAmount}` : ''}
${deadline ? `Deadline: ${deadline}` : ''}

${rfpText ? `RFP/Grant Guidelines:\n${rfpText}\n` : ''}

${teachingMaterials ? `Organization Background & Writing Style:\n${teachingMaterials}\n` : ''}

Please generate a complete grant proposal following best practices for nonprofit grant writing. Include:
1. Executive Summary
2. Statement of Need
3. Program Description
4. Expected Outcomes and Impact
5. Budget Summary

Make it compelling, data-driven, and aligned with the funder's priorities.`

  const agent = mastra.getAgent('grantWriting')
  const result = await agent.generate(prompt)

  return result.text
}

// Step: Save the generated proposal to the database
async function saveProposal(grantId: number, content: string) {
  'use step'

  const { db } = await import('@/db')
  const { grantApplications } = await import('@/db/schema')
  const { eq } = await import('drizzle-orm')

  await db
    .update(grantApplications)
    .set({
      proposalContent: content,
      status: 'Draft',
      updatedAt: new Date(),
    })
    .where(eq(grantApplications.id, grantId))

  return { success: true }
}

// Step: Log the activity
async function logActivity(userId: string, grantId: number, grantTitle: string) {
  'use step'

  const { db } = await import('@/db')
  const { activityLog } = await import('@/db/schema')

  await db.insert(activityLog).values({
    userId,
    action: 'grant_generated',
    entityType: 'grant',
    entityId: grantId,
    details: `Generated proposal for: ${grantTitle}`,
  })

  return { success: true }
}

// Step: Create notification for the user
async function notifyUser(userId: string, grantTitle: string) {
  'use step'

  const { db } = await import('@/db')
  const { notifications } = await import('@/db/schema')

  await db.insert(notifications).values({
    userId,
    type: 'system',
    title: 'Grant Proposal Generated',
    message: `Your grant proposal "${grantTitle}" has been generated successfully.`,
    read: false,
  })

  return { success: true }
}

/**
 * Main Grant Generation Workflow
 *
 * This workflow:
 * 1. Generates the grant proposal using AI
 * 2. Saves the proposal to the database
 * 3. Logs the activity
 * 4. Notifies the user
 */
export async function grantGenerationWorkflow(input: {
  grantId: number
  userId: string
  projectName: string
  funderName: string
  fundingAmount?: string
  deadline?: string
  rfpText?: string
  teachingMaterials?: string
}) {
  'use workflow'

  const {
    grantId,
    userId,
    projectName,
    funderName,
    fundingAmount,
    deadline,
    rfpText,
    teachingMaterials,
  } = input

  // Step 1: Generate the proposal content
  const content = await generateProposalContent(
    projectName,
    funderName,
    fundingAmount,
    deadline,
    rfpText,
    teachingMaterials
  )

  // Step 2: Save to database
  await saveProposal(grantId, content)

  // Step 3: Log the activity
  await logActivity(userId, grantId, projectName)

  // Step 4: Notify the user
  await notifyUser(userId, projectName)

  return {
    success: true,
    grantId,
    contentLength: content.length,
  }
}
