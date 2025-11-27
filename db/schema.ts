import { pgTable, text, serial, timestamp, integer, boolean, jsonb, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// CORE TABLES
// ============================================================================

// Users table (extends Stack Auth)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  organizationName: text('organization_name'),
  role: text('role'), // 'admin', 'grant_writer', 'fundraiser', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Organization Profiles - Detailed organization information
export const organizationProfiles = pgTable('organization_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  legalName: text('legal_name').notNull(),
  ein: text('ein'), // Tax ID
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  phone: text('phone'),
  website: text('website'),
  missionStatement: text('mission_statement'),
  yearEstablished: integer('year_established'),
  annualBudget: decimal('annual_budget', { precision: 12, scale: 2 }),
  staffCount: integer('staff_count'),
  boardSize: integer('board_size'),
  serviceArea: text('service_area'),
  populationServed: text('population_served'),
  programAreas: jsonb('program_areas'), // Array of focus areas
  logo: text('logo'), // URL to logo
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User Preferences - Application settings
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id),
  emailNotifications: boolean('email_notifications').default(true),
  inAppNotifications: boolean('in_app_notifications').default(true),
  notificationDigest: text('notification_digest').default('daily'), // 'realtime', 'daily', 'weekly'
  theme: text('theme').default('light'), // 'light', 'dark', 'auto'
  timezone: text('timezone').default('America/New_York'),
  language: text('language').default('en'),
  dashboardLayout: jsonb('dashboard_layout'), // Customizable dashboard
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User Sessions - Track login sessions
export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sessionToken: text('session_token').notNull().unique(),
  device: text('device'), // Device name/type
  browser: text('browser'), // Browser name
  os: text('os'), // Operating system
  location: text('location'), // City, State/Country
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isCurrent: boolean('is_current').default(false),
  lastActive: timestamp('last_active').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Team Members / Collaborators
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id), // Organization owner
  memberUserId: text('member_user_id').references(() => users.id), // Team member (if registered)
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'grant_writer', 'reviewer', 'admin', 'viewer'
  permissions: jsonb('permissions'), // Granular permissions
  status: text('status').default('active'), // 'active', 'inactive', 'pending'
  invitedAt: timestamp('invited_at').defaultNow().notNull(),
  joinedAt: timestamp('joined_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// GRANT MANAGEMENT
// ============================================================================

// Grant Opportunities - Searchable grants database
export const grantOpportunities = pgTable('grant_opportunities', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  organization: text('organization').notNull(),
  description: text('description').notNull(),
  amount: text('amount'),
  minAmount: decimal('min_amount', { precision: 12, scale: 2 }),
  maxAmount: decimal('max_amount', { precision: 12, scale: 2 }),
  deadline: timestamp('deadline'),
  category: text('category').notNull(),
  focusAreas: jsonb('focus_areas'), // Array of focus areas
  eligibility: jsonb('eligibility'), // Array of eligibility criteria
  geographicScope: text('geographic_scope'), // 'national', 'state', 'regional', 'local'
  location: text('location'), // City, state
  status: text('status').default('Open'), // 'Open', 'Closing Soon', 'Closed'
  matchScore: integer('match_score'), // Relevance score
  sourceUrl: text('source_url'),
  applicationUrl: text('application_url'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  requirements: text('requirements'),
  guidelines: text('guidelines'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Grant Applications
export const grantApplications = pgTable('grant_applications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  grantOpportunityId: integer('grant_opportunity_id').references(() => grantOpportunities.id),
  grantTitle: text('grant_title').notNull(),
  organization: text('organization').notNull(),
  funderName: text('funder_name').notNull(),
  focusArea: text('focus_area'),
  amount: decimal('amount', { precision: 12, scale: 2 }),
  deadline: timestamp('deadline'),
  status: text('status').notNull().default('Draft'), // 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'
  rfpText: text('rfp_text'),
  teachingMaterials: text('teaching_materials'),
  projectName: text('project_name'),
  proposalContent: text('proposal_content'),
  submittedAt: timestamp('submitted_at'),
  approvedAt: timestamp('approved_at'),
  rejectedAt: timestamp('rejected_at'),
  rejectionReason: text('rejection_reason'),
  awardAmount: decimal('award_amount', { precision: 12, scale: 2 }),
  projectStartDate: timestamp('project_start_date'),
  projectEndDate: timestamp('project_end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Grant Bookmarks - Saved grants
export const grantBookmarks = pgTable('grant_bookmarks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  grantOpportunityId: integer('grant_opportunity_id').notNull().references(() => grantOpportunities.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Saved Searches
export const savedSearches = pgTable('saved_searches', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  searchQuery: text('search_query'),
  filters: jsonb('filters'),
  notifyOnNewMatches: boolean('notify_on_new_matches').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Grant Search History
export const grantSearchHistory = pgTable('grant_search_history', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  searchQuery: text('search_query').notNull(),
  filters: jsonb('filters'),
  resultsCount: integer('results_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Grant Budgets - Overall budget for a grant
export const grantBudgets = pgTable('grant_budgets', {
  id: serial('id').primaryKey(),
  grantApplicationId: integer('grant_application_id').notNull().references(() => grantApplications.id),
  totalBudget: decimal('total_budget', { precision: 12, scale: 2 }).notNull(),
  personnelCosts: decimal('personnel_costs', { precision: 12, scale: 2 }),
  programCosts: decimal('program_costs', { precision: 12, scale: 2 }),
  administrativeCosts: decimal('administrative_costs', { precision: 12, scale: 2 }),
  indirectCosts: decimal('indirect_costs', { precision: 12, scale: 2 }),
  otherCosts: decimal('other_costs', { precision: 12, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Budget Line Items - Detailed budget items
export const budgetItems = pgTable('budget_items', {
  id: serial('id').primaryKey(),
  grantBudgetId: integer('grant_budget_id').notNull().references(() => grantBudgets.id),
  category: text('category').notNull(), // 'personnel', 'equipment', 'supplies', 'travel', etc.
  description: text('description').notNull(),
  quantity: integer('quantity'),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }),
  totalCost: decimal('total_cost', { precision: 12, scale: 2 }).notNull(),
  justification: text('justification'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Grant Milestones - Project deliverables and tracking
export const grantMilestones = pgTable('grant_milestones', {
  id: serial('id').primaryKey(),
  grantApplicationId: integer('grant_application_id').notNull().references(() => grantApplications.id),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  status: text('status').default('pending'), // 'pending', 'in_progress', 'completed', 'delayed'
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Grant Reports - Progress and final reports
export const grantReports = pgTable('grant_reports', {
  id: serial('id').primaryKey(),
  grantApplicationId: integer('grant_application_id').notNull().references(() => grantApplications.id),
  reportType: text('report_type').notNull(), // 'quarterly', 'annual', 'final', 'financial', 'narrative'
  title: text('title').notNull(),
  content: text('content'),
  reportingPeriodStart: timestamp('reporting_period_start'),
  reportingPeriodEnd: timestamp('reporting_period_end'),
  dueDate: timestamp('due_date'),
  submittedAt: timestamp('submitted_at'),
  status: text('status').default('draft'), // 'draft', 'submitted', 'approved', 'revision_requested'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// COMPLIANCE & TRACKING
// ============================================================================

// Compliance Items
export const complianceItems = pgTable('compliance_items', {
  id: serial('id').primaryKey(),
  grantId: integer('grant_id').references(() => grantApplications.id),
  userId: text('user_id').notNull().references(() => users.id),
  grantName: text('grant_name').notNull(),
  requirement: text('requirement').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  priority: text('priority').notNull().default('Medium'), // 'Low', 'Medium', 'High'
  status: text('status').notNull().default('Upcoming'), // 'Completed', 'Upcoming', 'Overdue'
  completedAt: timestamp('completed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// DONOR MANAGEMENT
// ============================================================================

// Donor Profiles
export const donors = pgTable('donors', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  organization: text('organization'),
  title: text('title'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  donorType: text('donor_type'), // 'Individual', 'Foundation', 'Corporate', 'Government'
  totalContributions: decimal('total_contributions', { precision: 12, scale: 2 }),
  relationshipStatus: text('relationship_status'), // 'Prospective', 'Active', 'Major', 'Lapsed'
  interests: jsonb('interests'), // Areas of interest
  notes: text('notes'),
  lastContactDate: timestamp('last_contact_date'),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  rating: integer('rating'), // 1-5 engagement rating
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Donor Interactions - Communication history
export const donorInteractions = pgTable('donor_interactions', {
  id: serial('id').primaryKey(),
  donorId: integer('donor_id').notNull().references(() => donors.id),
  userId: text('user_id').notNull().references(() => users.id),
  interactionType: text('interaction_type').notNull(), // 'call', 'email', 'meeting', 'event', 'other'
  subject: text('subject'),
  notes: text('notes'),
  outcome: text('outcome'),
  nextSteps: text('next_steps'),
  interactionDate: timestamp('interaction_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Donor Meeting Practice Sessions (AI Role-play)
export const donorMeetingSessions = pgTable('donor_meeting_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  donorId: integer('donor_id').references(() => donors.id),
  donorProfile: text('donor_profile'),
  donorType: text('donor_type'),
  warmthFactor: text('warmth_factor'),
  practiceFormat: text('practice_format'),
  conversationHistory: jsonb('conversation_history'),
  coachingTips: jsonb('coaching_tips'),
  score: integer('score'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// DOCUMENTS & TEMPLATES
// ============================================================================

// Documents - File uploads and attachments
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  entityType: text('entity_type'), // 'grant', 'donor', 'compliance', 'organization', etc.
  entityId: integer('entity_id'),
  fileName: text('file_name').notNull(),
  fileType: text('file_type'), // 'pdf', 'docx', 'xlsx', 'image', etc.
  fileSize: integer('file_size'), // in bytes
  fileUrl: text('file_url').notNull(), // Vercel Blob URL
  category: text('category'), // 'proposal', 'budget', 'report', 'supporting_doc', etc.
  description: text('description'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Templates - Proposal and document templates
export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // null for system templates
  name: text('name').notNull(),
  description: text('description'),
  templateType: text('template_type').notNull(), // 'proposal', 'budget', 'letter', 'report', 'email'
  category: text('category'),
  content: text('content').notNull(),
  variables: jsonb('variables'), // Template variables/placeholders
  isPublic: boolean('is_public').default(false),
  isSystem: boolean('is_system').default(false),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Email Templates - For donor communications
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  purpose: text('purpose'), // 'thank_you', 'follow_up', 'event_invite', 'update', etc.
  variables: jsonb('variables'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

// Knowledge Base / Teachings (for AI Grant Genie)
export const knowledgeBase = pgTable('knowledge_base', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category'), // 'writing_style', 'organization_info', 'past_proposals', 'best_practices', etc.
  tags: jsonb('tags'),
  attachments: jsonb('attachments'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================================
// NOTIFICATIONS & ACTIVITY
// ============================================================================

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // 'critical', 'update', 'info', 'success', 'warning'
  category: text('category'), // 'deadline', 'compliance', 'approval', 'submission', etc.
  title: text('title').notNull(),
  message: text('message').notNull(),
  entityType: text('entity_type'), // 'grant', 'compliance', 'donor', etc.
  entityId: integer('entity_id'),
  actionUrl: text('action_url'), // Link to relevant page
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Activity Log
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type'), // 'grant', 'donor', 'compliance', etc.
  entityId: integer('entity_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================================
// GENIE SESSIONS - Unified storage for all AI Genie interactions
// ============================================================================

// Genie Sessions - stores all genie types in one flexible table
export const genieSessions = pgTable('genie_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),

  // Session identification
  name: text('name').notNull(), // User-provided name for the session
  genieType: text('genie_type').notNull(), // 'grant_writing', 'donor_meeting', 'newsletter', 'email_management'

  // Status tracking
  status: text('status').notNull().default('draft'), // 'draft', 'in_progress', 'completed', 'archived'

  // Flexible configuration storage (JSON)
  config: jsonb('config').notNull().default('{}'), // Type-specific configuration

  // Input data
  inputData: jsonb('input_data'), // User-provided input (RFP text, donor profile, etc.)

  // Output/Results
  outputContent: text('output_content'), // Generated content (proposal, email draft, etc.)
  outputMetadata: jsonb('output_metadata'), // Additional output data (scores, tips, etc.)

  // Conversation history (for chat-based genies)
  conversationHistory: jsonb('conversation_history'), // Array of {role, content, timestamp}

  // Execution tracking
  executionCount: integer('execution_count').default(0), // How many times regenerated
  lastExecutedAt: timestamp('last_executed_at'),

  // Associated entities (optional)
  grantApplicationId: integer('grant_application_id').references(() => grantApplications.id),
  donorId: integer('donor_id').references(() => donors.id),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Genie Execution History - tracks each execution/regeneration
export const genieExecutions = pgTable('genie_executions', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => genieSessions.id, { onDelete: 'cascade' }),

  // Execution details
  executionNumber: integer('execution_number').notNull(),
  inputSnapshot: jsonb('input_snapshot'), // Snapshot of input at execution time
  outputSnapshot: text('output_snapshot'), // Output from this execution

  // Metadata
  durationMs: integer('duration_ms'),
  tokensUsed: integer('tokens_used'),
  status: text('status').notNull().default('success'), // 'success', 'error', 'partial'
  errorMessage: text('error_message'),

  // Timestamps
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================================
// RELATIONS
// ============================================================================

export const genieSessionsRelations = relations(genieSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [genieSessions.userId],
    references: [users.id],
  }),
  grantApplication: one(grantApplications, {
    fields: [genieSessions.grantApplicationId],
    references: [grantApplications.id],
  }),
  donor: one(donors, {
    fields: [genieSessions.donorId],
    references: [donors.id],
  }),
  executions: many(genieExecutions),
}))

export const genieExecutionsRelations = relations(genieExecutions, ({ one }) => ({
  session: one(genieSessions, {
    fields: [genieExecutions.sessionId],
    references: [genieSessions.id],
  }),
}))

export const usersRelations = relations(users, ({ many, one }) => ({
  grantApplications: many(grantApplications),
  complianceItems: many(complianceItems),
  donors: many(donors),
  donorMeetingSessions: many(donorMeetingSessions),
  genieSessions: many(genieSessions),
  knowledgeBase: many(knowledgeBase),
  activityLog: many(activityLog),
  grantSearchHistory: many(grantSearchHistory),
  notifications: many(notifications),
  documents: many(documents),
  templates: many(templates),
  bookmarks: many(grantBookmarks),
  savedSearches: many(savedSearches),
  sessions: many(userSessions),
  teamMembers: many(teamMembers, { relationName: 'organizationOwner' }),
  memberOf: many(teamMembers, { relationName: 'teamMember' }),
  organizationProfile: one(organizationProfiles),
  preferences: one(userPreferences),
}))

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}))

export const grantOpportunitiesRelations = relations(grantOpportunities, ({ many }) => ({
  applications: many(grantApplications),
  bookmarks: many(grantBookmarks),
}))

export const grantApplicationsRelations = relations(grantApplications, ({ one, many }) => ({
  user: one(users, {
    fields: [grantApplications.userId],
    references: [users.id],
  }),
  grantOpportunity: one(grantOpportunities, {
    fields: [grantApplications.grantOpportunityId],
    references: [grantOpportunities.id],
  }),
  complianceItems: many(complianceItems),
  milestones: many(grantMilestones),
  reports: many(grantReports),
  budget: one(grantBudgets),
}))

export const grantBudgetsRelations = relations(grantBudgets, ({ one, many }) => ({
  grantApplication: one(grantApplications, {
    fields: [grantBudgets.grantApplicationId],
    references: [grantApplications.id],
  }),
  lineItems: many(budgetItems),
}))

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
  budget: one(grantBudgets, {
    fields: [budgetItems.grantBudgetId],
    references: [grantBudgets.id],
  }),
}))

export const grantMilestonesRelations = relations(grantMilestones, ({ one }) => ({
  grantApplication: one(grantApplications, {
    fields: [grantMilestones.grantApplicationId],
    references: [grantApplications.id],
  }),
}))

export const grantReportsRelations = relations(grantReports, ({ one }) => ({
  grantApplication: one(grantApplications, {
    fields: [grantReports.grantApplicationId],
    references: [grantApplications.id],
  }),
}))

export const complianceItemsRelations = relations(complianceItems, ({ one }) => ({
  user: one(users, {
    fields: [complianceItems.userId],
    references: [users.id],
  }),
  grant: one(grantApplications, {
    fields: [complianceItems.grantId],
    references: [grantApplications.id],
  }),
}))

export const donorsRelations = relations(donors, ({ one, many }) => ({
  user: one(users, {
    fields: [donors.userId],
    references: [users.id],
  }),
  meetingSessions: many(donorMeetingSessions),
  interactions: many(donorInteractions),
}))

export const donorInteractionsRelations = relations(donorInteractions, ({ one }) => ({
  donor: one(donors, {
    fields: [donorInteractions.donorId],
    references: [donors.id],
  }),
  user: one(users, {
    fields: [donorInteractions.userId],
    references: [users.id],
  }),
}))

export const donorMeetingSessionsRelations = relations(donorMeetingSessions, ({ one }) => ({
  user: one(users, {
    fields: [donorMeetingSessions.userId],
    references: [users.id],
  }),
  donor: one(donors, {
    fields: [donorMeetingSessions.donorId],
    references: [donors.id],
  }),
}))

export const knowledgeBaseRelations = relations(knowledgeBase, ({ one }) => ({
  user: one(users, {
    fields: [knowledgeBase.userId],
    references: [users.id],
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}))

export const grantSearchHistoryRelations = relations(grantSearchHistory, ({ one }) => ({
  user: one(users, {
    fields: [grantSearchHistory.userId],
    references: [users.id],
  }),
}))

export const grantBookmarksRelations = relations(grantBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [grantBookmarks.userId],
    references: [users.id],
  }),
  grantOpportunity: one(grantOpportunities, {
    fields: [grantBookmarks.grantOpportunityId],
    references: [grantOpportunities.id],
  }),
}))

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(users, {
    fields: [savedSearches.userId],
    references: [users.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}))

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
}))

export const emailTemplatesRelations = relations(emailTemplates, ({ one }) => ({
  user: one(users, {
    fields: [emailTemplates.userId],
    references: [users.id],
  }),
}))

export const organizationProfilesRelations = relations(organizationProfiles, ({ one }) => ({
  user: one(users, {
    fields: [organizationProfiles.userId],
    references: [users.id],
  }),
}))

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  organization: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
    relationName: 'organizationOwner',
  }),
  member: one(users, {
    fields: [teamMembers.memberUserId],
    references: [users.id],
    relationName: 'teamMember',
  }),
}))
