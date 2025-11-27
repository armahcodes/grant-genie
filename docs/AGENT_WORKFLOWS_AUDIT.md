# Agent Workflows Audit Report

## Executive Summary

The application uses **Mastra AI framework** with **OpenAI GPT-4 Turbo** for three main agent workflows:
1. **Grant Writing Agent** - Generates grant proposals
2. **Donor Meeting Agent** - Simulates donor conversations for practice
3. **General Assistant Agent** - Provides general nonprofit guidance

**Critical Issues Found:**
- ❌ Missing OpenAI API key configuration in Mastra
- ❌ Missing API route for General Assistant (`/api/ai/assistant`)
- ❌ Missing API route for ending donor sessions (`/api/ai/donor-meeting/end-session`)
- ❌ Inconsistent error handling across agents
- ❌ Missing authentication/rate limiting on some routes
- ❌ Donor practice response format mismatch
- ❌ Streaming response handling issues

---

## 🔴 Critical Issues

### 1. Missing OpenAI API Key Configuration ⚠️ **CRITICAL**

**Problem:**
- Mastra agents are created but OpenAI API key is not configured
- `lib/mastra/index.ts` doesn't pass API key to Mastra
- Agents will fail at runtime

**Current Code:**
```typescript
// lib/mastra/index.ts
export const mastra = new Mastra({
  agents: {
    grantWriting: grantWritingAgent,
    donorMeeting: donorMeetingAgent,
    generalAssistant: generalAssistantAgent,
  },
})
// ❌ No OpenAI API key configured!
```

**Expected:**
```typescript
import { createOpenAI } from '@ai-sdk/openai'
import { env } from '@/lib/env'

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export const mastra = new Mastra({
  providers: {
    openai,
  },
  agents: {
    grantWriting: grantWritingAgent,
    donorMeeting: donorMeetingAgent,
    generalAssistant: generalAssistantAgent,
  },
})
```

**Impact:** 🔴 **CRITICAL** - All agents will fail to make API calls

---

### 2. Missing API Routes ⚠️ **HIGH PRIORITY**

**Missing Routes:**

**Route 1:** `/api/ai/assistant` (General Assistant)
- **Called by:** `useGeneralAssistant()` hook
- **Expected:** POST endpoint for general assistant queries
- **Status:** ❌ **MISSING**

**Route 2:** `/api/ai/donor-meeting/end-session`
- **Called by:** `useDonorMeetingAgent().endSession()`
- **Expected:** POST endpoint to end donor practice session
- **Status:** ❌ **MISSING**

**Impact:** ⚠️ **HIGH** - These features will fail when used

---

### 3. Authentication & Rate Limiting Issues ⚠️ **MEDIUM PRIORITY**

**Routes Missing Auth/Rate Limiting:**
- ❌ `/api/ai/chat` - No auth, no rate limiting
- ❌ `/api/ai/donor-practice` - No auth, no rate limiting
- ✅ `/api/ai/generate-grant` - Has auth + rate limiting
- ✅ `/api/ai/support` - Has auth only

**Impact:** ⚠️ **MEDIUM** - Security vulnerability, potential abuse

---

### 4. Response Format Mismatch ⚠️ **MEDIUM PRIORITY**

**Problem:**
- `/api/ai/donor-practice` returns streaming response (`stream.toUIMessageStreamResponse()`)
- Frontend expects JSON: `{ response, coachingTip?, score? }`
- Frontend tries to parse streaming response as JSON

**Current Backend:**
```typescript
// app/api/ai/donor-practice/route.ts
const stream = await agent.stream(messagesWithContext, {
  format: 'aisdk',
})
return stream.toUIMessageStreamResponse() // ❌ Returns stream, not JSON
```

**Current Frontend:**
```typescript
// lib/agents/hooks.ts
const data = await response.json() // ❌ Expects JSON, gets stream
const assistantMessage = {
  role: 'assistant' as const,
  content: data.response, // ❌ data.response doesn't exist
}
```

**Impact:** ⚠️ **MEDIUM** - Donor practice will fail

---

### 5. Streaming Response Handling Issues ⚠️ **LOW PRIORITY**

**Problem:**
- `/api/ai/generate-grant` creates manual stream wrapper
- Doesn't use Mastra's streaming properly
- Inconsistent with other agent routes

**Current Code:**
```typescript
// app/api/ai/generate-grant/route.ts
const result = await agent.generate(prompt) // Non-streaming
const text = result.text || result.toString()
// Then manually creates stream wrapper...
```

**Better Approach:**
```typescript
const stream = await agent.stream(prompt, {
  format: 'aisdk',
})
return stream.toUIMessageStreamResponse()
```

**Impact:** ⚠️ **LOW** - Works but inefficient

---

### 6. Error Handling Inconsistencies ⚠️ **LOW PRIORITY**

**Issues:**
- Some routes return standardized `errorResponse()`
- Others return plain `Response` with error text
- Inconsistent error messages

**Example:**
```typescript
// ❌ Inconsistent
return new Response('Error processing chat', { status: 500 })

// ✅ Should be
return errorResponse('Failed to process chat', 500)
```

---

## 📊 Agent Architecture Overview

### Agent Types

**1. Grant Writing Agent** (`grantWriting`)
- **File:** `lib/mastra/agents/grant-writing.ts`
- **Model:** `openai/gpt-4-turbo`
- **Purpose:** Generate grant proposals
- **API Route:** `/api/ai/generate-grant` ✅
- **Status:** ⚠️ Missing OpenAI config

**2. Donor Meeting Agent** (`donorMeeting`)
- **File:** `lib/mastra/agents/donor-meeting.ts`
- **Model:** `openai/gpt-4-turbo`
- **Purpose:** Simulate donor conversations
- **API Route:** `/api/ai/donor-practice` ⚠️ (format mismatch)
- **API Route:** `/api/ai/donor-meeting/end-session` ❌ (missing)
- **Status:** ⚠️ Response format issue

**3. General Assistant Agent** (`generalAssistant`)
- **File:** `lib/mastra/agents/general-assistant.ts`
- **Model:** `openai/gpt-4-turbo`
- **Purpose:** General nonprofit guidance
- **API Route:** `/api/ai/assistant` ❌ (missing)
- **API Route:** `/api/ai/chat` ⚠️ (uses this but wrong route)
- **Status:** ❌ Route mismatch

**4. Support Genie** (Not Mastra-based)
- **File:** `/api/ai/support`
- **Purpose:** Rule-based support responses
- **Status:** ✅ Works (but not AI-powered)

---

## 🔄 Data Flow Analysis

### Grant Writing Workflow

**Frontend → Backend → Agent → Response**

1. **Frontend Hook:** `useGrantWritingAgent()`
   - Location: `lib/agents/hooks.ts`
   - Uses: `useGrantGenieStore` for form data
   - Calls: `POST /api/ai/generate-grant`

2. **API Route:** `/api/ai/generate-grant`
   - Location: `app/api/ai/generate-grant/route.ts`
   - ✅ Has auth (`requireAuth`)
   - ✅ Has rate limiting (`strictRateLimit`)
   - ✅ Has validation (`generateGrantSchema`)
   - ⚠️ Missing OpenAI config

3. **Agent:** `grantWritingAgent`
   - Location: `lib/mastra/agents/grant-writing.ts`
   - Creates prompt from form data
   - Calls: `agent.generate(prompt)`
   - ⚠️ Will fail without OpenAI config

4. **Response:** Streaming text
   - ✅ Frontend handles streaming correctly
   - ✅ Updates Zustand store (`setProposalContent`)

**Issues:**
- ❌ Missing OpenAI API key config
- ⚠️ Manual stream wrapper (inefficient)

---

### Donor Meeting Workflow

**Frontend → Backend → Agent → Response**

1. **Frontend Hook:** `useDonorMeetingAgent()`
   - Location: `lib/agents/hooks.ts`
   - Uses: `useDonorGenieStore` for session config
   - Calls: `POST /api/ai/donor-practice`

2. **API Route:** `/api/ai/donor-practice`
   - Location: `app/api/ai/donor-practice/route.ts`
   - ❌ No auth
   - ❌ No rate limiting
   - ⚠️ Returns stream, frontend expects JSON

3. **Agent:** `donorMeetingAgent`
   - Adds system context from session config
   - Calls: `agent.stream(messagesWithContext)`
   - ⚠️ Response format mismatch

4. **Response:** ❌ **FORMAT MISMATCH**
   - Backend returns: Streaming response
   - Frontend expects: `{ response, coachingTip?, score? }`
   - ❌ Causes runtime error

**Issues:**
- ❌ Missing auth
- ❌ Missing rate limiting
- 🔴 **Response format mismatch** (critical)
- ❌ Missing `/api/ai/donor-meeting/end-session` route

---

### General Assistant Workflow

**Frontend → Backend → Agent → Response**

1. **Frontend Hook:** `useGeneralAssistant()`
   - Location: `lib/agents/hooks.ts`
   - Calls: `POST /api/ai/assistant` ❌ **MISSING**

2. **API Route:** `/api/ai/assistant` ❌ **DOES NOT EXIST**
   - Expected location: `app/api/ai/assistant/route.ts`
   - Status: ❌ **MISSING**

3. **Alternative Route:** `/api/ai/chat`
   - Location: `app/api/ai/chat/route.ts`
   - ❌ No auth
   - ❌ No rate limiting
   - ⚠️ Wrong API contract

**Issues:**
- 🔴 **Missing route** (critical)
- ❌ Missing auth
- ❌ Missing rate limiting

---

## 📋 Detailed Findings

### Backend Configuration

**Mastra Setup:**
- ✅ Agents defined correctly
- ✅ Instructions are clear
- ❌ **Missing OpenAI provider configuration**
- ❌ **No API key passed to Mastra**

**Environment Variables:**
- ✅ `OPENAI_API_KEY` validated in `lib/env.ts`
- ❌ Not used in Mastra setup

---

### API Routes Status

| Route | Auth | Rate Limit | Validation | Status | Issues |
|-------|------|------------|------------|--------|--------|
| `/api/ai/generate-grant` | ✅ | ✅ | ✅ | ✅ | Missing OpenAI config |
| `/api/ai/donor-practice` | ❌ | ❌ | ❌ | ⚠️ | Format mismatch, no auth |
| `/api/ai/chat` | ❌ | ❌ | ❌ | ⚠️ | No auth, wrong contract |
| `/api/ai/support` | ✅ | ❌ | ⚠️ | ✅ | Not AI-powered |
| `/api/ai/assistant` | ❌ | ❌ | ❌ | ❌ | **MISSING** |
| `/api/ai/donor-meeting/end-session` | ❌ | ❌ | ❌ | ❌ | **MISSING** |

---

### Frontend Hooks Status

| Hook | API Route | Status | Issues |
|------|-----------|--------|--------|
| `useGrantWritingAgent()` | `/api/ai/generate-grant` | ✅ | Works (needs OpenAI config) |
| `useDonorMeetingAgent()` | `/api/ai/donor-practice` | 🔴 | Response format mismatch |
| `useDonorMeetingAgent().endSession()` | `/api/ai/donor-meeting/end-session` | 🔴 | Route missing |
| `useGeneralAssistant()` | `/api/ai/assistant` | 🔴 | Route missing |

---

## 🎯 Recommendations

### Immediate Actions (Critical)

1. **Configure OpenAI API Key in Mastra**
   ```typescript
   import { createOpenAI } from '@ai-sdk/openai'
   import { env } from '@/lib/env'

   const openai = createOpenAI({
     apiKey: env.OPENAI_API_KEY,
   })

   export const mastra = new Mastra({
     providers: {
       openai,
     },
     agents: {
       grantWriting: grantWritingAgent,
       donorMeeting: donorMeetingAgent,
       generalAssistant: generalAssistantAgent,
     },
   })
   ```

2. **Create Missing API Routes**
   - `/api/ai/assistant` - General assistant endpoint
   - `/api/ai/donor-meeting/end-session` - End donor session

3. **Fix Response Format Mismatch**
   - Option A: Change backend to return JSON (not stream)
   - Option B: Change frontend to handle streaming

4. **Add Authentication & Rate Limiting**
   - Add to `/api/ai/chat`
   - Add to `/api/ai/donor-practice`

### High Priority

5. **Standardize Error Handling**
   - Use `errorResponse()` everywhere
   - Consistent error messages

6. **Fix Streaming Implementation**
   - Use Mastra's streaming properly
   - Consistent across all routes

### Medium Priority

7. **Add Request Validation**
   - Validate all request bodies
   - Use Zod schemas consistently

8. **Add Logging**
   - Log agent usage
   - Track errors and performance

---

## 📈 Expected Improvements

**After Fixes:**
- ✅ All agents functional
- ✅ All API routes exist
- ✅ Consistent authentication
- ✅ Proper rate limiting
- ✅ Correct response formats
- ✅ Better error handling

---

## 🔍 Files That Need Changes

**Critical:**
- `lib/mastra/index.ts` - Add OpenAI configuration
- `app/api/ai/assistant/route.ts` - **CREATE** (missing)
- `app/api/ai/donor-meeting/end-session/route.ts` - **CREATE** (missing)
- `app/api/ai/donor-practice/route.ts` - Fix response format
- `lib/agents/hooks.ts` - Fix response handling

**High Priority:**
- `app/api/ai/chat/route.ts` - Add auth + rate limiting
- `app/api/ai/donor-practice/route.ts` - Add auth + rate limiting
- `app/api/ai/generate-grant/route.ts` - Fix streaming

**Medium Priority:**
- All API routes - Standardize error handling
- Add request validation schemas

