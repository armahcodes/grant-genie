/**
 * Mastra AI Configuration
 *
 * Configured to use Vercel AI Gateway
 * Agents use GPT-4 Turbo via AI Gateway
 */

import { Mastra } from '@mastra/core'
import { env } from '@/lib/env'
import { grantWritingAgent } from './agents/grant-writing'
import { donorMeetingAgent } from './agents/donor-meeting'
import { generalAssistantAgent } from './agents/general-assistant'

// Note: AI Gateway credentials are configured via environment variables
// AI_GATEWAY_API_KEY is validated in lib/env.ts

// Initialize Mastra with agents only (providers handled by agents)
export const mastra = new Mastra({
  agents: {
    grantWriting: grantWritingAgent,
    donorMeeting: donorMeetingAgent,
    generalAssistant: generalAssistantAgent,
  },
})

export { grantWritingAgent, donorMeetingAgent, generalAssistantAgent }
