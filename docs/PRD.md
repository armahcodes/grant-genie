# Product Requirements Document (PRD)
# HeadspaceGenie.ai (formerly Grant Genie)

**Version:** 1.0
**Date:** October 26, 2025
**Status:** Beta/MVP
**Document Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Technical Architecture](#technical-architecture)
4. [User Personas](#user-personas)
5. [Feature Specifications](#feature-specifications)
6. [User Flows](#user-flows)
7. [Data Models](#data-models)
8. [API Specifications](#api-specifications)
9. [AI Agent Capabilities](#ai-agent-capabilities)
10. [Non-Functional Requirements](#non-functional-requirements)
11. [Future Roadmap](#future-roadmap)
12. [Known Issues & Technical Debt](#known-issues--technical-debt)

---

## 1. Executive Summary

### Product Name & Tagline
**HeadspaceGenie.ai** - *Headspace for humans who lead. AI with a soul.*

### Vision
To give mission-driven leaders back their headspace by providing an AI ecosystem that writes, organizes, and thinks with them — so they can focus on what matters most: changing lives.

### Mission
Empower nonprofit leaders, fundraisers, and social impact organizations to work more effectively through AI-powered grant writing, donor engagement, and operational automation while maintaining their authentic voice and values.

### Target Audience
- **Primary:** Small to mid-sized nonprofit organizations (1-50 staff)
- **Secondary:** Individual fundraisers, grant writers, and social impact consultants
- **Tertiary:** Foundations, networks, and multi-site organizations

### Key Value Propositions
1. **Time Savings:** Automate 20-30 hours of grant writing per proposal
2. **Voice Preservation:** AI learns your organization's authentic writing style
3. **Donor Confidence:** Practice donor conversations and objection handling
4. **Compliance Peace of Mind:** Never miss a deadline or requirement
5. **Mission Focus:** Reclaim headspace for strategic thinking and impact work

---

## 2. Product Overview

### Problem Statement

Mission-driven leaders face overwhelming administrative burdens:
- **73% report burnout** from administrative work (cited in landing page)
- **Endless grant deadlines** with complex requirements
- **Donor meeting anxiety** without adequate preparation
- **Time poverty** prevents strategic thinking and creativity
- **Generic AI tools** that don't understand nonprofit nuance

### Solution

HeadspaceGenie.ai provides a modular AI ecosystem of specialized "Genies":

1. **Grant Genie** - Writes compelling grant proposals in your voice
2. **Donor Conversation Coach** - Role-plays fundraising meetings
3. **Newsletter & Content Genie** - Creates engaging communications
4. **Operations & Onboarding Genie** - Automates workflows
5. **Custom Genie Builder** - Create your own specialized assistants

### Key Differentiators

1. **Built for Humans** - AI learns your nuance, not just your data
2. **Centered in Values** - Designed for empathy, equity, and storytelling
3. **Modular by Design** - Start with one Genie, grow into an ecosystem
4. **Cross-Sector Ready** - Works for nonprofits, funders, staffing agencies
5. **Powered by OpenAI + Heart** - World-class models guided by lived experience

---

## 3. Technical Architecture

### Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 16.0.0 (Turbopack) |
| **Runtime** | React | 19.0.0 |
| **Language** | TypeScript | 5.x |
| **UI Library** | Chakra UI | 3.28.0 |
| **Styling** | Emotion + Chakra | 11.14.0 |
| **Authentication** | Stack Auth | 2.8.46 |
| **Database** | PostgreSQL (Neon) | Latest |
| **ORM** | Drizzle ORM | 0.44.7 |
| **AI Framework** | Mastra AI | 0.23.1 |
| **AI Models** | OpenAI GPT-4 Turbo | Via Mastra |
| **State Management** | Zustand | 5.0.8 |
| **File Storage** | Vercel Blob | 2.0.0 |
| **Form Handling** | React Hook Form | 7.65.0 |
| **Data Fetching** | TanStack Query | 5.90.5 |
| **Analytics** | Vercel Analytics | 1.5.0 |
| **Icons** | React Icons (Feather) | 5.5.0 |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Landing Page │  │  Dashboard   │  │  Genie Apps  │      │
│  │  (/)         │  │  (/dashboard)│  │  (Multiple)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐   │
│  │ User     │ │ Grant    │ │ Donor    │ │ UI + Notif  │   │
│  │ Store    │ │ Genie    │ │ Genie    │ │ Stores      │   │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────┘   │
│                   (Zustand with Persistence)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        API LAYER                             │
│  /api/ai/generate-grant    - Grant generation               │
│  /api/ai/donor-practice    - Donor meeting simulation       │
│  /api/grants/*             - Grant CRUD operations          │
│  /api/compliance/*         - Compliance tracking            │
│  /api/donors/*             - Donor management               │
│  /api/documents/*          - File uploads                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      AI AGENT LAYER                          │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Grant Writing      │  │ Donor Meeting      │            │
│  │ Agent              │  │ Agent              │            │
│  │ (GPT-4 Turbo)      │  │ (GPT-4 Turbo)      │            │
│  └────────────────────┘  └────────────────────┘            │
│               Powered by Mastra AI Framework                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Vercel Blob │  │  Stack Auth  │      │
│  │  (Neon)      │  │  (Files)     │  │  (Sessions)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           Managed via Drizzle ORM                            │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Stack Auth (OAuth + Email)
    ↓
Sign Up → Onboarding → Dashboard
    ↓
Protected Routes (ProtectedRoute wrapper with Suspense)
```

### File Structure

```
grant-genie/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Main dashboard
│   ├── auth/                    # Authentication pages
│   ├── grant-application/       # Grant Genie workflow
│   ├── genies/                  # Genie hub and apps
│   │   ├── donor-meeting/      # Donor Genie
│   │   ├── newsletter/         # Newsletter Genie
│   │   └── ...
│   ├── compliance-tracker/      # Compliance management
│   ├── grant-search/            # Grant discovery
│   ├── reporting/               # Analytics
│   ├── notifications/           # Notification center
│   ├── api/                     # API routes
│   │   ├── ai/                 # AI endpoints
│   │   ├── grants/             # Grant CRUD
│   │   ├── compliance/         # Compliance API
│   │   └── ...
│   └── handler/[...stack]/     # Stack Auth handler
├── components/                   # React components
│   ├── layout/                  # Layout components
│   ├── auth/                    # Auth components
│   └── ui/                      # UI primitives
├── lib/                         # Utilities and configs
│   ├── mastra/                  # AI agents
│   │   └── agents/
│   ├── store/                   # Zustand stores
│   ├── utils/                   # Helper functions
│   └── validation/              # Validation schemas
├── db/                          # Database
│   └── schema.ts               # Drizzle schema
└── public/                      # Static assets
```

---

## 4. User Personas

### Persona 1: Sarah - Executive Director

**Demographics:**
- Age: 38
- Role: Executive Director, small nonprofit (8 staff)
- Experience: 12 years in nonprofit sector

**Goals:**
- Secure sustainable funding for programs
- Spend more time on strategy, less on administration
- Maintain authentic organizational voice in communications

**Pain Points:**
- Drowning in grant deadlines and reporting requirements
- Lack of time for donor cultivation
- Burnout from wearing too many hats

**Use Cases:**
- Generate grant proposals that sound like her organization
- Practice donor pitches before major meetings
- Track compliance deadlines across multiple grants

---

### Persona 2: Marcus - Grant Writer

**Demographics:**
- Age: 29
- Role: Full-time Grant Writer
- Experience: 4 years grant writing

**Goals:**
- Increase grant success rate
- Reduce time spent on routine applications
- Learn funder preferences and best practices

**Pain Points:**
- Repetitive content across similar proposals
- Difficulty matching tone to different funders
- Limited time for research and strategy

**Use Cases:**
- Use AI to draft initial proposals based on templates
- Train AI on organization's past successful grants
- Generate multiple versions for A/B testing

---

### Persona 3: Jennifer - Development Director

**Demographics:**
- Age: 45
- Role: Development Director
- Experience: 18 years in fundraising

**Goals:**
- Build strong donor relationships
- Improve team's fundraising skills
- Streamline donor communications

**Pain Points:**
- Nervous team members need practice with donor asks
- Time-consuming donor stewardship communications
- Difficulty tracking donor interactions

**Use Cases:**
- Use Donor Genie to role-play difficult conversations
- Generate personalized thank-you emails
- Practice handling objections before meetings

---

## 5. Feature Specifications

### 5.1 Landing Page

**Status:** ✅ Completed

**Description:**
Premium marketing landing page with full feature showcase, pricing, and conversion paths.

**User Stories:**
- As a visitor, I want to understand what HeadspaceGenie offers
- As a nonprofit leader, I want to see pricing options
- As a prospective user, I want to start a free trial

**Acceptance Criteria:**
- [x] Hero section with clear value proposition
- [x] Feature showcase for all 5 Genies
- [x] Pricing tiers (Starter, Growth, Pro Builder, Enterprise)
- [x] FAQ section with 8+ common questions
- [x] Responsive design (mobile, tablet, desktop)
- [x] Premium animations and visual effects
- [x] Call-to-action buttons throughout
- [x] Contact and demo request options

**Technical Notes:**
- Uses glassmorphic design with purple/teal gradient theme
- Animated floating Genie cards
- Sticky mobile CTA button
- Unsplash images for visual appeal
- Fully accessible with ARIA labels

**Dependencies:**
- Stack Auth for signup/signin
- Next.js Image optimization

**Location:** `app/page.tsx`

---

### 5.2 Authentication System

**Status:** ✅ Completed

**Description:**
Complete authentication flow using Stack Auth with email and OAuth support.

**User Stories:**
- As a new user, I want to create an account
- As a returning user, I want to sign in securely
- As an authenticated user, I want to access protected pages

**Acceptance Criteria:**
- [x] Sign up page with email/OAuth
- [x] Sign in page with email/OAuth
- [x] Protected route wrapper for authenticated pages
- [x] Proper Suspense boundaries for SSR
- [x] Radix UI Tooltip Provider for Stack Auth compatibility
- [x] Session persistence
- [x] Automatic redirect after authentication

**Technical Notes:**
- Stack Auth integration with `@stackframe/stack` v2.8.46
- TooltipProvider re-exports Radix UI Provider
- ProtectedRoute component wraps useUser() in Suspense
- Handler route at `/handler/[...stack]` (fixed from `/handler/stack-auth/[...stack]`)

**Dependencies:**
- Stack Auth configuration in `lib/stack.ts`
- Environment variables for Stack Auth project

**Locations:**
- `app/auth/signin/page.tsx`
- `app/auth/signup/page.tsx`
- `app/handler/[...stack]/page.tsx`
- `components/auth/ProtectedRoute.tsx`
- `components/ui/tooltip.tsx`

---

### 5.3 Onboarding Workflow

**Status:** ⚠️ In Progress (Placeholder)

**Description:**
Post-signup onboarding to capture organization details and preferences.

**User Stories:**
- As a new user, I want to set up my organization profile
- As a new user, I want to configure my preferences
- As a new user, I want a guided tour of the platform

**Acceptance Criteria:**
- [ ] Multi-step onboarding form
- [ ] Organization profile capture
- [ ] Writing style upload/training
- [ ] Preference configuration
- [ ] Welcome tour/tutorial
- [ ] Skip option for advanced users

**Technical Notes:**
- Uses Stack Auth `useUser({ or: "redirect" })`
- Wrapped in Suspense boundary
- Redirects to `/dashboard` on completion

**Location:** `app/onboarding/page.tsx`

---

### 5.4 Dashboard

**Status:** ✅ Completed

**Description:**
Centralized command center showing grants, deadlines, compliance, and quick actions.

**User Stories:**
- As a user, I want to see my grant portfolio at a glance
- As a user, I want to be alerted to urgent deadlines
- As a user, I want quick access to all Genies
- As a user, I want to track recent activity

**Acceptance Criteria:**
- [x] Premium header with gradient background
- [x] 4 key metric cards (Active Grants, Total Funding, Deadlines, Compliance Rate)
- [x] Recent applications list (5 items)
- [x] Upcoming deadlines list (5 items)
- [x] Quick action buttons for all Genies
- [x] Recent activity timeline
- [x] Responsive grid layout
- [x] Loading states and skeleton screens
- [x] Empty states for new users
- [x] Animated stat counters

**Technical Notes:**
- Uses mock data from `lib/mockData.ts`
- Animated stats with easing functions
- Purple/teal branded color scheme
- Keyboard accessible cards
- Real-time clock display
- Contextual greeting (morning/afternoon/evening)

**Dependencies:**
- Mock data (currently)
- Future: Real data from API

**Location:** `app/dashboard/page.tsx`

---

### 5.5 Grant Genie (Grant Application)

**Status:** ✅ Completed

**Description:**
AI-powered grant writing workflow that learns your voice and generates proposals.

**User Stories:**
- As a grant writer, I want to input grant requirements
- As a grant writer, I want to upload my writing samples
- As a grant writer, I want AI to draft a proposal in my style
- As a grant writer, I want to edit and refine the output

**Acceptance Criteria:**
- [x] Two-column input form
- [x] RFP/Guidelines upload or paste
- [x] Teaching materials upload (past grants, writing samples)
- [x] Project context fields (name, funder, amount, deadline)
- [x] Drag-and-drop file upload
- [x] File validation (PDF, DOC, DOCX, TXT, max 10MB)
- [x] Input summary preview
- [x] Generate button with validation
- [x] Proposal output page with formatting
- [x] Regenerate and edit options
- [x] Save to database functionality
- [x] Toast notifications for success/errors

**Technical Notes:**
- State managed via Zustand (`useGrantGenieStore`)
- Form data persisted to localStorage
- AI generation via `/api/ai/generate-grant`
- Proposal formatted with line breaks and structure
- File upload state managed locally
- Form validation with inline error messages

**Dependencies:**
- Grant Writing Agent (Mastra AI)
- OpenAI GPT-4 Turbo
- Zustand store
- Vercel Blob (planned for file storage)

**Locations:**
- `app/grant-application/page.tsx` (Input form)
- `app/grant-application/proposal/page.tsx` (Output)
- `lib/store/index.ts` (State)
- `app/api/ai/generate-grant/route.ts` (API)

---

### 5.6 Donor Genie (Donor Meeting Coach)

**Status:** ✅ Completed (Setup Page)

**Description:**
AI role-playing for donor meeting practice, objection handling, and pitch refinement.

**User Stories:**
- As a fundraiser, I want to practice donor conversations
- As a fundraiser, I want to prepare for objections
- As a fundraiser, I want feedback on my pitch
- As a fundraiser, I want to save session insights

**Acceptance Criteria:**
- [x] Donor profile input (LinkedIn, research, past interactions)
- [x] Donor type selection (Major Individual, Foundation, Corporate, Planned Giving)
- [x] Warmth factor customization
- [x] Anticipated objections field
- [x] Practice format selection (conversation, pitch, objection-only)
- [x] Knowledge base option
- [x] Session preview
- [ ] Live practice conversation interface
- [ ] Real-time coaching tips
- [ ] Session scoring and feedback
- [ ] Save session for review

**Technical Notes:**
- State managed via Zustand (`useDonorGenieStore`)
- Configuration persisted to localStorage
- Practice session at `/genies/donor-meeting/practice`
- AI agent: Donor Meeting Genie (Mastra AI)

**Dependencies:**
- Donor Meeting Agent
- OpenAI GPT-4 Turbo
- Zustand store

**Locations:**
- `app/genies/donor-meeting/page.tsx` (Setup)
- `app/genies/donor-meeting/practice/page.tsx` (Practice)
- `app/genies/donor-meeting/summary/page.tsx` (Summary)
- `lib/store/index.ts` (State)
- `lib/mastra/agents/donor-meeting.ts` (Agent)

---

### 5.7 Genies Hub

**Status:** ✅ Completed

**Description:**
Central hub to access all AI Genies and create custom assistants.

**User Stories:**
- As a user, I want to see all available Genies
- As a user, I want to navigate to specific Genies
- As a user, I want to create custom Genies
- As a user, I want a personalized welcome

**Acceptance Criteria:**
- [x] Welcome message with user name
- [x] 4 Genie cards (Grant, Donor, Newsletter, Email)
- [x] Create New Genie option (placeholder)
- [x] Keyboard navigation
- [x] Hover states and animations
- [x] Responsive grid layout

**Technical Notes:**
- Simple routing to specialized Genie pages
- Newsletter and Email Genies are placeholders
- Custom Genie Builder not yet implemented

**Location:** `app/genies/page.tsx`

---

###  5.8 Compliance Tracker

**Status:** ⚠️ In Progress (Uses Mock Data)

**Description:**
Track grant compliance requirements, deadlines, and submissions.

**User Stories:**
- As a grants manager, I want to see all compliance tasks
- As a grants manager, I want to filter by status
- As a grants manager, I want priority indicators
- As a grants manager, I want to mark tasks complete

**Acceptance Criteria:**
- [ ] Overview stats (completed, pending, overdue)
- [ ] Tabbed view (All, Completed, Upcoming, Overdue)
- [ ] Priority indicators (High, Medium, Low)
- [ ] Due date tracking
- [ ] Quick upload actions
- [ ] Bulk operations
- [ ] Email reminders

**Technical Notes:**
- Currently uses mock data
- Needs backend integration
- Purple/teal themed UI

**Location:** `app/compliance-tracker/page.tsx`

---

### 5.9 Grant Search & Discovery

**Status:** ⚠️ Placeholder (Uses Mock Data)

**Description:**
Search database of grant opportunities with AI-powered matching.

**User Stories:**
- As a grant seeker, I want to search for relevant grants
- As a grant seeker, I want to filter by criteria
- As a grant seeker, I want to bookmark opportunities
- As a grant seeker, I want match score rankings

**Acceptance Criteria:**
- [ ] Keyword search
- [ ] Filter by category, amount, deadline, location
- [ ] AI match scoring
- [ ] Grant detail cards
- [ ] Bookmark/save functionality
- [ ] Start application from search
- [ ] Saved searches

**Technical Notes:**
- Mock grants database currently
- Needs external grant data source or manual entry
- AI matching algorithm to be developed

**Location:** `app/grant-search/page.tsx`

---

### 5.10 Notifications Center

**Status:** ⚠️ Placeholder

**Description:**
Centralized notification management with filtering and preferences.

**User Stories:**
- As a user, I want to see all my notifications
- As a user, I want to filter by type
- As a user, I want to mark as read
- As a user, I want to configure notification preferences

**Acceptance Criteria:**
- [ ] Critical alerts section
- [ ] Recent updates feed
- [ ] Filter by type and date
- [ ] Mark all as read
- [ ] Notification preferences
- [ ] Email digest configuration

**Location:** `app/notifications/page.tsx`

---

### 5.11 Reporting & Analytics

**Status:** ⚠️ Placeholder

**Description:**
Grant performance analytics, funding reports, and custom exports.

**User Stories:**
- As a leader, I want to see funding secured
- As a leader, I want success rate metrics
- As a leader, I want compliance health
- As a leader, I want custom reports

**Acceptance Criteria:**
- [ ] Key metrics dashboard
- [ ] Funding by category breakdown
- [ ] Grant performance table
- [ ] Custom report builder
- [ ] Export to PDF, Excel, CSV
- [ ] Date range filtering

**Location:** `app/reporting/page.tsx`

---

### 5.12 Resources Hub

**Status:** ⚠️ Placeholder

**Description:**
Templates, guides, and AI copilot for grant management education.

**User Stories:**
- As a user, I want access to grant templates
- As a user, I want best practice guides
- As a user, I want to chat with AI copilot
- As a user, I want management tools

**Acceptance Criteria:**
- [ ] AI Grant Copilot chatbot
- [ ] Template library (Federal, Foundation, Corporate)
- [ ] Best practice guides
- [ ] Budget calculator
- [ ] Timeline planner
- [ ] Compliance checklist

**Location:** `app/resources/page.tsx`

---

### 5.13 Profile & Settings

**Status:** ⚠️ Placeholder

**Description:**
User profile management and application settings.

**User Stories:**
- As a user, I want to update my profile
- As a user, I want to manage organization details
- As a user, I want to configure preferences
- As a user, I want to upload my photo

**Acceptance Criteria:**
- [ ] Personal information form
- [ ] Organization details
- [ ] Address information
- [ ] Profile photo upload
- [ ] Notification preferences
- [ ] Theme selection
- [ ] Timezone configuration

**Locations:**
- `app/profile/page.tsx`
- `app/settings/page.tsx`

---

## 6. User Flows

### 6.1 New User Sign Up Flow

```
1. Land on homepage (/)
   ↓
2. Click "Join Beta" or "Start Free Trial"
   ↓
3. Redirect to /auth/signup
   ↓
4. Complete signup form (email + password or OAuth)
   ↓
5. Stack Auth creates account and session
   ↓
6. Redirect to /onboarding
   ↓
7. Complete onboarding (organization setup, preferences)
   ↓
8. Redirect to /dashboard
   ↓
9. See welcome message and empty states
```

### 6.2 Existing User Sign In Flow

```
1. Navigate to /auth/signin or click "Log In"
   ↓
2. Enter credentials (email + password or OAuth)
   ↓
3. Stack Auth validates and creates session
   ↓
4. Redirect to /dashboard
   ↓
5. See personalized dashboard with active grants
```

### 6.3 Grant Writing Flow (Grant Genie)

```
1. From Dashboard, click "Start Writing" or navigate to /grant-application
   ↓
2. Upload or paste RFP/Guidelines (optional)
   ↓
3. Upload or paste teaching materials (past grants, writing samples)
   ↓
4. Fill in project context:
   - Project/Program Name (required)
   - Funder Name (required)
   - Funding Amount
   - Deadline
   ↓
5. Review input summary
   ↓
6. Click "Generate Draft"
   ↓
7. System validates required fields
   ↓
8. POST to /api/ai/generate-grant with form data
   ↓
9. Grant Writing Agent processes with GPT-4 Turbo
   ↓
10. Redirect to /grant-application/proposal
   ↓
11. Show loading spinner while generating
   ↓
12. Display formatted proposal with:
    - Executive Summary
    - Statement of Need
    - Program Description
    - Expected Outcomes
    - Budget Summary
   ↓
13. User options:
    - Edit Inputs (return to form)
    - Regenerate (create new version)
    - Save to Database
    - Export/Download
```

### 6.4 Donor Meeting Practice Flow (Donor Genie)

```
1. From Dashboard or Genies Hub, navigate to /genies/donor-meeting
   ↓
2. Configure practice session:
   - Upload/paste donor profile (LinkedIn, research)
   - Select donor type (Individual, Foundation, Corporate, Planned Giving)
   - Describe warmth factor
   - List anticipated objections
   - Select practice format (conversation, pitch, objection-only)
   - Toggle knowledge base usage
   ↓
3. Review practice session preview
   ↓
4. Click "Start Practice Session"
   ↓
5. Redirect to /genies/donor-meeting/practice
   ↓
6. AI agent simulates donor conversation
   ↓
7. User responds via text or voice input
   ↓
8. Agent provides real-time coaching tips
   ↓
9. Complete practice session
   ↓
10. Navigate to /genies/donor-meeting/summary
   ↓
11. View:
    - Session score
    - Coaching feedback
    - Conversation transcript
    - Next steps recommendations
   ↓
12. Options:
    - Save session
    - Export notes
    - Start new session
```

### 6.5 Compliance Tracking Flow

```
1. From Dashboard, see upcoming deadlines alert
   ↓
2. Click "View Tasks" or navigate to /compliance-tracker
   ↓
3. See overview stats (completed, pending, overdue)
   ↓
4. Filter by status tab (All, Completed, Upcoming, Overdue)
   ↓
5. View task cards with:
    - Grant name
    - Requirement description
    - Due date
    - Priority level
    - Status
   ↓
6. Click task to:
    - Upload document
    - Mark complete
    - Add notes
    - Set reminder
   ↓
7. Receive notifications for approaching deadlines
```

### 6.6 Grant Search Flow

```
1. From Dashboard, click "Discover Grants"
   ↓
2. Navigate to /grant-search
   ↓
3. Enter search keywords
   ↓
4. Apply filters:
    - Category
    - Funding amount range
    - Deadline
    - Location
   ↓
5. View results sorted by match score
   ↓
6. Review grant details:
    - Description
    - Eligibility criteria
    - Requirements
    - Deadlines
   ↓
7. Options for each grant:
    - Bookmark for later
    - Start application (→ Grant Genie)
    - View full details
```

---

## 7. Data Models

### 7.1 Core Tables

#### Users
```typescript
{
  id: string (PK)
  email: string (unique)
  name: string
  organizationName: string
  role: string // 'admin', 'grant_writer', 'fundraiser'
  createdAt: timestamp
  updatedAt: timestamp
}
```

Relations: Has many grants, donors, compliance items, documents

---

#### Organization Profiles
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  legalName: string
  ein: string // Tax ID
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website: string
  missionStatement: text
  yearEstablished: number
  annualBudget: decimal
  staffCount: number
  boardSize: number
  serviceArea: string
  populationServed: string
  programAreas: jsonb
  logo: string // URL
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### User Preferences
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id, unique)
  emailNotifications: boolean (default: true)
  inAppNotifications: boolean (default: true)
  notificationDigest: string (default: 'daily') // 'realtime', 'daily', 'weekly'
  theme: string (default: 'light') // 'light', 'dark', 'auto'
  timezone: string (default: 'America/New_York')
  language: string (default: 'en')
  dashboardLayout: jsonb
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 7.2 Grant Management Tables

#### Grant Opportunities
```typescript
{
  id: serial (PK)
  title: string
  organization: string
  description: text
  amount: string
  minAmount: decimal
  maxAmount: decimal
  deadline: timestamp
  category: string
  focusAreas: jsonb
  eligibility: jsonb
  geographicScope: string // 'national', 'state', 'regional', 'local'
  location: string
  status: string (default: 'Open') // 'Open', 'Closing Soon', 'Closed'
  matchScore: number
  sourceUrl: string
  applicationUrl: string
  contactEmail: string
  contactPhone: string
  requirements: text
  guidelines: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Grant Applications
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  grantOpportunityId: number (FK → grant_opportunities.id)
  grantTitle: string
  organization: string
  funderName: string
  focusArea: string
  amount: decimal
  deadline: timestamp
  status: string (default: 'Draft') // 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'
  rfpText: text
  teachingMaterials: text
  projectName: string
  proposalContent: text
  submittedAt: timestamp
  approvedAt: timestamp
  rejectedAt: timestamp
  rejectionReason: text
  awardAmount: decimal
  projectStartDate: timestamp
  projectEndDate: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Grant Budgets
```typescript
{
  id: serial (PK)
  grantApplicationId: number (FK → grant_applications.id)
  totalBudget: decimal
  personnelCosts: decimal
  programCosts: decimal
  administrativeCosts: decimal
  indirectCosts: decimal
  otherCosts: decimal
  notes: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Budget Items
```typescript
{
  id: serial (PK)
  grantBudgetId: number (FK → grant_budgets.id)
  category: string // 'personnel', 'equipment', 'supplies', 'travel'
  description: string
  quantity: number
  unitCost: decimal
  totalCost: decimal
  justification: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 7.3 Compliance & Tracking Tables

#### Compliance Items
```typescript
{
  id: serial (PK)
  grantId: number (FK → grant_applications.id)
  userId: string (FK → users.id)
  grantName: string
  requirement: string
  description: text
  dueDate: timestamp
  priority: string (default: 'Medium') // 'Low', 'Medium', 'High'
  status: string (default: 'Upcoming') // 'Completed', 'Upcoming', 'Overdue'
  completedAt: timestamp
  notes: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Grant Milestones
```typescript
{
  id: serial (PK)
  grantApplicationId: number (FK → grant_applications.id)
  title: string
  description: text
  dueDate: timestamp
  status: string (default: 'pending') // 'pending', 'in_progress', 'completed', 'delayed'
  completedAt: timestamp
  notes: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 7.4 Donor Management Tables

#### Donors
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  name: string
  email: string
  phone: string
  organization: string
  title: string
  address: string
  city: string
  state: string
  zipCode: string
  donorType: string // 'Individual', 'Foundation', 'Corporate', 'Government'
  totalContributions: decimal
  relationshipStatus: string // 'Prospective', 'Active', 'Major', 'Lapsed'
  interests: jsonb
  notes: text
  lastContactDate: timestamp
  nextFollowUpDate: timestamp
  rating: number // 1-5
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Donor Interactions
```typescript
{
  id: serial (PK)
  donorId: number (FK → donors.id)
  userId: string (FK → users.id)
  interactionType: string // 'call', 'email', 'meeting', 'event', 'other'
  subject: string
  notes: text
  outcome: text
  nextSteps: text
  interactionDate: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Donor Meeting Sessions
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  donorId: number (FK → donors.id)
  donorProfile: text
  donorType: string
  warmthFactor: string
  practiceFormat: string
  conversationHistory: jsonb
  coachingTips: jsonb
  score: number
  feedback: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 7.5 Knowledge & Templates Tables

#### Knowledge Base
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  title: string
  content: text
  category: string // 'writing_style', 'organization_info', 'past_proposals', 'best_practices'
  tags: jsonb
  attachments: jsonb
  isPublic: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

#### Templates
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id) // null for system templates
  name: string
  description: text
  templateType: string // 'proposal', 'budget', 'letter', 'report', 'email'
  category: string
  content: text
  variables: jsonb
  isPublic: boolean (default: false)
  isSystem: boolean (default: false)
  usageCount: number (default: 0)
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

### 7.6 Activity & Notifications Tables

#### Notifications
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  type: string // 'critical', 'update', 'info', 'success', 'warning'
  category: string // 'deadline', 'compliance', 'approval', 'submission'
  title: string
  message: string
  entityType: string // 'grant', 'compliance', 'donor'
  entityId: number
  actionUrl: string
  read: boolean (default: false)
  readAt: timestamp
  createdAt: timestamp
}
```

---

#### Activity Log
```typescript
{
  id: serial (PK)
  userId: string (FK → users.id)
  action: string
  entityType: string
  entityId: number
  details: text
  ipAddress: string
  userAgent: string
  createdAt: timestamp
}
```

---

## 8. API Specifications

### 8.1 AI Endpoints

#### POST /api/ai/generate-grant

**Purpose:** Generate grant proposal using Grant Writing Agent

**Request Body:**
```json
{
  "projectName": "Community Health Initiative",
  "funderName": "National Health Foundation",
  "fundingAmount": "$250,000",
  "deadline": "2025-12-15",
  "rfpText": "Guidelines for community health programs...",
  "teachingMaterials": "Past grant examples and writing samples..."
}
```

**Response:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

[Streaming text of generated proposal]
```

**Success:** 200 OK (streaming response)
**Errors:**
- 400 Bad Request (missing projectName or funderName)
- 500 Internal Server Error (AI generation failure)

**Location:** `app/api/ai/generate-grant/route.ts`

---

#### POST /api/ai/donor-practice

**Purpose:** Simulate donor conversation using Donor Meeting Agent

**Request Body:**
```json
{
  "donorProfile": "LinkedIn profile...",
  "donorType": "Individual",
  "warmthFactor": "Enthusiastic",
  "practiceMode": "conversation",
  "userMessage": "I wanted to share our program impact..."
}
```

**Response:**
```json
{
  "agentResponse": "That's wonderful. Can you tell me more about the measurable outcomes?",
  "coachingTip": "Great start! Consider using specific data to strengthen your point.",
  "score": 8
}
```

**Location:** `app/api/ai/donor-practice/route.ts`

---

### 8.2 Grant Management Endpoints

#### GET /api/grants

**Purpose:** List all grants for authenticated user

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "grants": [...],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

---

#### POST /api/grants

**Purpose:** Create new grant application

**Request Body:**
```json
{
  "grantTitle": "...",
  "organization": "...",
  "funderName": "...",
  "amount": 250000,
  "deadline": "2025-12-15"
}
```

**Response:**
```json
{
  "id": 123,
  "grantTitle": "...",
  "status": "Draft",
  "createdAt": "2025-10-26T..."
}
```

---

#### GET /api/grants/:id

**Purpose:** Get single grant application

**Response:**
```json
{
  "id": 123,
  "grantTitle": "...",
  "proposalContent": "...",
  "status": "Draft",
  ...
}
```

---

#### PUT /api/grants/:id

**Purpose:** Update grant application

**Request Body:** Partial grant object

**Response:** Updated grant object

---

#### DELETE /api/grants/:id

**Purpose:** Delete grant application

**Response:** 204 No Content

---

### 8.3 Compliance Endpoints

#### GET /api/compliance

**Purpose:** List compliance items

**Query Parameters:**
- `status`: Filter by status
- `priority`: Filter by priority
- `grantId`: Filter by grant

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "grantName": "...",
      "requirement": "...",
      "dueDate": "2025-11-01",
      "status": "Upcoming",
      "priority": "High"
    }
  ]
}
```

---

#### POST /api/compliance

**Purpose:** Create compliance item

#### PUT /api/compliance/:id

**Purpose:** Update compliance item (e.g., mark complete)

---

### 8.4 Document Endpoints

#### POST /api/upload

**Purpose:** Upload document to Vercel Blob

**Request:** FormData with file

**Response:**
```json
{
  "fileUrl": "https://blob.vercel-storage.com/...",
  "fileName": "...",
  "fileSize": 1024000
}
```

---

## 9. AI Agent Capabilities

### 9.1 Grant Writing Agent

**Name:** Grant Writing Genie
**Model:** OpenAI GPT-4 Turbo
**Framework:** Mastra AI

**Capabilities:**
1. Generate compelling, data-driven grant proposals
2. Align content with funder priorities and guidelines
3. Use clear, impact-focused language
4. Include specific metrics and measurable outcomes
5. Match organization's writing style from reference materials

**Output Structure:**
- Executive Summary (compelling overview with key impact points)
- Statement of Need (data-driven problem description)
- Program Description (detailed methodology and approach)
- Expected Outcomes (specific, measurable goals)
- Budget Summary (clear breakdown aligned with program activities)

**Tone:** Professional yet accessible, focused on community impact, sustainability, and alignment with funder values

**Training:**
- Can be trained on organization's past successful grants
- Learns from teaching materials (writing samples, past proposals)
- Adapts to funder-specific requirements from RFP text

**Location:** `lib/mastra/agents/grant-writing.ts`

---

### 9.2 Donor Meeting Agent

**Name:** Donor Meeting Genie
**Model:** OpenAI GPT-4 Turbo
**Framework:** Mastra AI

**Capabilities:**
1. Simulate realistic donor conversations based on donor profiles
2. Provide coaching on effective donor communication strategies
3. Help practice responses to objections and difficult questions
4. Teach "listen more than ask" approach
5. Focus on reducing "I" statements and increasing "You" focus

**Interaction Modes:**
- Role-play donor conversations
- Practice elevator pitches
- Handle specific objections
- Provide real-time feedback

**Coaching Focus:**
- Ask thoughtful questions donors might ask
- Feedback to help responses sound donor-centric
- Incorporate data and storytelling
- Identify next steps and follow-up actions
- Encourage reflection on what resonates

**Adaptability:**
- Adjusts tone based on donor type (major individual, foundation, corporate, planned giving)
- Adapts to warmth factor (enthusiastic vs. analytical)
- Scales difficulty based on user's practice needs

**Location:** `lib/mastra/agents/donor-meeting.ts`

---

### 9.3 Future Agents (Planned)

#### Newsletter & Content Genie
- Drafts newsletters, volunteer follow-ups, and social posts
- Maintains organization's tone and voice
- Keeps community inspired and engaged

#### Operations & Onboarding Genie
- Automates applicant intake and onboarding
- Workflow communication automation
- Maintains human-centered, affirming tone
- Provides real-time visibility for leadership

#### Custom Genie Builder
- User-created custom Genies
- Trained on user's specific documents and workflows
- Empowers teams to automate with heart

---

## 10. Non-Functional Requirements

### 10.1 Performance

- **Page Load Time:** < 2 seconds for initial load
- **Time to Interactive:** < 3 seconds
- **AI Generation:** < 30 seconds for grant proposals
- **Database Queries:** < 500ms for most operations
- **File Upload:** Support up to 10MB files
- **Concurrent Users:** Support 100+ simultaneous users

### 10.2 Security

- **Authentication:** Stack Auth with OAuth and email/password
- **Session Management:** Secure cookie-based tokens
- **Data Encryption:** 256-bit encryption for data at rest
- **API Security:** Rate limiting on all endpoints
- **File Uploads:** Virus scanning and type validation
- **CORS:** Strict origin policies
- **SQL Injection:** Protected via Drizzle ORM parameterized queries
- **XSS Protection:** React automatic escaping + CSP headers

### 10.3 Scalability

- **Database:** PostgreSQL with connection pooling (Neon)
- **File Storage:** Vercel Blob (unlimited scalability)
- **Serverless Functions:** Auto-scaling via Vercel
- **Caching:** Static assets cached via CDN
- **State Management:** Client-side Zustand for offline capability

### 10.4 Accessibility

- **WCAG Level:** AA compliance target
- **Screen Readers:** Full ARIA label support
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Focus Management:** Clear focus indicators
- **Color Contrast:** Minimum 4.5:1 ratio for text
- **Responsive Design:** Works on mobile, tablet, desktop

### 10.5 Browser Support

- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **Edge:** Latest 2 versions
- **Mobile:** iOS Safari 14+, Chrome Android latest

### 10.6 Reliability

- **Uptime Target:** 99.5%
- **Error Handling:** Graceful degradation for all failures
- **Data Backup:** Automated daily backups
- **Recovery Time:** < 4 hours for critical failures

### 10.7 Monitoring & Analytics

- **Vercel Analytics:** Page views, performance metrics
- **Vercel Speed Insights:** Core Web Vitals tracking
- **Error Tracking:** (To be implemented)
- **User Analytics:** Privacy-focused tracking

---

## 11. Future Roadmap

### Phase 1: MVP Completion (Current)
**Status:** 70% Complete

Priority Features:
- ✅ Landing page with pricing
- ✅ Authentication (Stack Auth)
- ✅ Dashboard with stats
- ✅ Grant Genie (full workflow)
- ✅ Donor Genie (setup page)
- ⚠️ Database integration (schema complete, needs API implementation)
- ⚠️ Onboarding workflow
- ⚠️ File upload to Vercel Blob

---

### Phase 2: Core Feature Enhancement (Q4 2025)

**Grant Genie Enhancements:**
- [ ] Version history for proposals
- [ ] Collaborative editing
- [ ] Template library
- [ ] Export to Word/PDF with formatting
- [ ] Budget builder integration
- [ ] Multi-language support

**Donor Genie Enhancements:**
- [ ] Voice-based practice (speech-to-text)
- [ ] Video recording of practice sessions
- [ ] Session analytics and progress tracking
- [ ] Donor database integration
- [ ] Meeting notes auto-capture
- [ ] Follow-up task automation

**Compliance:**
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Automated email reminders
- [ ] Document version tracking
- [ ] Audit trail
- [ ] Bulk upload functionality

---

### Phase 3: New Genies (Q1 2026)

**Newsletter & Content Genie:**
- [ ] Email campaign drafting
- [ ] Social media post generation
- [ ] Volunteer communication
- [ ] Donor stewardship letters
- [ ] Annual report assistance

**Operations & Onboarding Genie:**
- [ ] Applicant intake automation
- [ ] Volunteer onboarding workflows
- [ ] Staff onboarding materials
- [ ] Policy and procedure drafting
- [ ] Meeting agenda generation

**Custom Genie Builder:**
- [ ] No-code Genie creation interface
- [ ] Document upload for training
- [ ] Workflow automation builder
- [ ] Integration with external tools
- [ ] API access for advanced users

---

### Phase 4: Advanced Features (Q2-Q3 2026)

**Grant Search:**
- [ ] AI-powered grant matching algorithm
- [ ] Integration with GrantStation, Foundation Center
- [ ] Saved search alerts
- [ ] Automated eligibility screening
- [ ] Grant deadline calendar

**Reporting & Analytics:**
- [ ] Predictive success scoring
- [ ] Funding pipeline forecasting
- [ ] ROI analysis per grant
- [ ] Funder relationship tracking
- [ ] Board reporting dashboards

**Collaboration:**
- [ ] Team workspaces
- [ ] Role-based permissions (viewer, editor, admin)
- [ ] Comments and review workflows
- [ ] Activity feeds
- [ ] Shared template library

---

### Phase 5: Enterprise Features (Q4 2026)

**Multi-Organization:**
- [ ] Multi-tenant architecture
- [ ] Organization switching
- [ ] Cross-organization reporting
- [ ] White-label options

**Integrations:**
- [ ] Salesforce connector
- [ ] Bloomerang connector
- [ ] Blackbaud connector
- [ ] Google Workspace integration
- [ ] Microsoft 365 integration
- [ ] Slack notifications
- [ ] Zapier webhooks

**Advanced AI:**
- [ ] Custom model fine-tuning
- [ ] Organization-specific knowledge bases
- [ ] Predictive grant recommendations
- [ ] Automated funder research
- [ ] Impact measurement AI

---

## 12. Known Issues & Technical Debt

### 12.1 Critical Issues

**None currently blocking MVP.**

---

### 12.2 High Priority Issues

1. **Database Not Connected**
   - Status: Schema complete, APIs not implemented
   - Impact: All data is currently mock/ephemeral
   - Resolution: Implement Drizzle ORM queries in API routes
   - Timeline: Phase 1

2. **File Upload Not Functional**
   - Status: UI ready, Vercel Blob integration incomplete
   - Impact: Users cannot upload RFPs or teaching materials
   - Resolution: Complete file upload handlers
   - Timeline: Phase 1

3. **Authentication Redirect Issues (Recently Fixed)**
   - Status: ✅ Fixed - Handler moved from `/handler/stack-auth/[...stack]` to `/handler/[...stack]`
   - Impact: Login flow now works correctly
   - Resolution: Completed

---

### 12.3 Medium Priority Issues

1. **Tooltip Provider Warning**
   - Status: ✅ Fixed - Now re-exports Radix UI Provider
   - Impact: No runtime errors
   - Resolution: Completed

2. **Suspense Boundary Warnings**
   - Status: ✅ Fixed - Added Suspense wrappers to auth components
   - Impact: No SSR bailout errors
   - Resolution: Completed

3. **Mock Data Throughout**
   - Status: Temporary
   - Impact: Demo works, but no real persistence
   - Resolution: Replace with API calls as database is connected
   - Timeline: Phase 1

4. **Incomplete Onboarding**
   - Status: Placeholder page exists
   - Impact: New users don't have guided setup
   - Resolution: Build multi-step onboarding flow
   - Timeline: Phase 1

5. **No Error Boundaries**
   - Status: Basic error handling only
   - Impact: Unhandled errors could crash UI
   - Resolution: Add React Error Boundaries
   - Timeline: Phase 2

---

### 12.4 Low Priority / Nice-to-Have

1. **Emoji Characters**
   - Status: ✅ Removed from all UI headings per user request
   - Impact: Cleaner, more professional appearance
   - Resolution: Completed

2. **Limited Keyboard Shortcuts**
   - Status: Basic keyboard navigation only
   - Impact: Power users want more shortcuts
   - Resolution: Implement keyboard shortcut system
   - Timeline: Phase 3

3. **No Dark Mode Implementation**
   - Status: Theme toggle exists but not functional
   - Impact: Users want dark mode
   - Resolution: Implement theme switching with Chakra UI
   - Timeline: Phase 2

4. **Limited Mobile Optimization**
   - Status: Responsive but not mobile-first
   - Impact: Some mobile UX could be better
   - Resolution: Mobile-specific optimizations
   - Timeline: Phase 2

5. **No Internationalization (i18n)**
   - Status: English only
   - Impact: Limited to English-speaking markets
   - Resolution: Add i18n framework
   - Timeline: Phase 4

---

### 12.5 Technical Debt

1. **TypeScript `any` Types**
   - Location: Multiple agent and API files
   - Impact: Reduced type safety
   - Resolution: Add proper type definitions
   - Timeline: Ongoing

2. **Console Errors in Production**
   - Location: Various development logs
   - Impact: Console noise
   - Resolution: Remove or gate behind environment checks
   - Timeline: Before production launch

3. **Inconsistent Error Handling**
   - Location: API routes
   - Impact: Some errors not properly caught
   - Resolution: Standardize error handling pattern
   - Timeline: Phase 2

4. **No Unit Tests**
   - Location: Entire codebase
   - Impact: Hard to catch regressions
   - Resolution: Add Jest + React Testing Library
   - Timeline: Phase 2

5. **No E2E Tests**
   - Location: N/A
   - Impact: Manual testing required
   - Resolution: Add Playwright or Cypress
   - Timeline: Phase 3

6. **Hardcoded Theme Tokens**
   - Location: Multiple component files
   - Impact: Hard to change theme globally
   - Resolution: Consolidate to single theme file (already started in `theme/tokens.ts`)
   - Timeline: Phase 2

---

## Appendix A: Color Palette

### Brand Colors

```typescript
colors.brand = {
  deepIndigo: '#3D2E6B',
  softTeal: '#5CE1E6',
  tealVariant: '#4BC5CC',
  indigoVariant: '#5A4A8C',
  indigoDark: '#2D2C5A'
}
```

### Semantic Colors

- **Success:** Green.500
- **Error:** Red.500
- **Warning:** Orange.500
- **Info:** Blue.500
- **Primary:** Purple.600
- **Background:** Purple.50

---

## Appendix B: Pricing Tiers

### Starter - $79/month
**For:** Small nonprofits or solopreneurs

**Features:**
- 1 Core Genie (Grant, Donor, Content, or Operations)
- 10 document generations/month
- Onboarding support
- 14-day free trial

---

### Growth - $249/month (MOST POPULAR)
**For:** Small to mid-sized teams

**Features:**
- 3 Genies
- Shared workspace
- Tone training
- Analytics dashboard
- Priority support

---

### Pro Builder - $499/month
**For:** Ecosystem builders + consultants

**Features:**
- Unlimited Genie creation
- API access
- Training suite
- White-label options
- Dedicated support

---

### Enterprise / Custom
**For:** Funders, networks, or multi-site organizations

**Features:**
- Full custom AI ecosystem
- Onboarding & setup included
- Internal AI literacy training
- Custom integrations
- SLA guarantee

---

## Appendix C: Key Metrics

**Success Metrics:**
- Grant Genie saves 20-30 hours per proposal
- 95% AI match score for grant opportunities
- 94% compliance rate tracked
- $1.245M total funding managed (demo data)
- 73% of nonprofit leaders report burnout (problem metric)

---

## Appendix D: References

**Technologies:**
- Next.js: https://nextjs.org
- Chakra UI: https://chakra-ui.com
- Stack Auth: https://stack-auth.com
- Mastra AI: https://mastra.ai
- Drizzle ORM: https://orm.drizzle.team
- Vercel: https://vercel.com

**Design Inspiration:**
- Landing page follows modern SaaS best practices
- Premium purple/teal gradient aesthetic
- Glassmorphism and floating animations

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-26 | Claude Code | Initial comprehensive PRD based on codebase audit |

---

**END OF DOCUMENT**
