/**
 * Zod Validation Schemas
 * 
 * Converted from TypeBox schemas for runtime validation
 */

import { z } from 'zod'

// Grant Application Schemas
export const grantApplicationSchema = z.object({
  grantTitle: z.string().min(1).max(500),
  organization: z.string().min(1).max(300),
  funderName: z.string().min(1).max(300),
  focusArea: z.string().max(200).optional(),
  amount: z.string().optional(),
  deadline: z.string().datetime().optional(),
  status: z.enum(['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected']).default('Draft'),
  rfpText: z.string().optional(),
  teachingMaterials: z.string().optional(),
  projectName: z.string().max(300).optional(),
  proposalContent: z.string().optional(),
})

export const createGrantApplicationSchema = grantApplicationSchema.pick({
  grantTitle: true,
  organization: true,
  funderName: true,
  focusArea: true,
  amount: true,
  deadline: true,
  rfpText: true,
  teachingMaterials: true,
  projectName: true,
})

export const updateGrantApplicationSchema = grantApplicationSchema.partial()

// Compliance Item Schemas
export const complianceItemSchema = z.object({
  grantId: z.number().optional(),
  grantName: z.string().min(1).max(300),
  requirement: z.string().min(1).max(500),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  status: z.enum(['Completed', 'Upcoming', 'Overdue']).default('Upcoming'),
  notes: z.string().optional(),
})

export const createComplianceItemSchema = complianceItemSchema.pick({
  grantId: true,
  grantName: true,
  requirement: true,
  description: true,
  dueDate: true,
  priority: true,
})

export const updateComplianceItemSchema = complianceItemSchema.partial()

// Donor Schemas
export const donorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  donorType: z.enum(['Individual', 'Foundation', 'Corporate', 'Government']).optional(),
  totalContributions: z.string().optional(),
  relationshipStatus: z.enum(['Prospective', 'Active', 'Major', 'Lapsed']).optional(),
  interests: z.array(z.string()).optional(),
  notes: z.string().optional(),
  lastContactDate: z.string().datetime().optional(),
  nextFollowUpDate: z.string().datetime().optional(),
})

export const createDonorSchema = donorSchema.pick({
  name: true,
  email: true,
  phone: true,
  organization: true,
  title: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  donorType: true,
  notes: true,
})

export const updateDonorSchema = donorSchema.partial()

// Donor Meeting Session Schemas
export const donorMeetingSessionSchema = z.object({
  donorId: z.number().optional(),
  donorProfile: z.string().min(1),
  donorType: z.string().min(1),
  warmthFactor: z.string().min(1),
  practiceFormat: z.string().min(1),
  conversationHistory: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })).optional(),
  coachingTips: z.array(z.string()).optional(),
  score: z.number().min(0).max(100).optional(),
})

export const createDonorMeetingSessionSchema = donorMeetingSessionSchema.pick({
  donorId: true,
  donorProfile: true,
  donorType: true,
  warmthFactor: true,
  practiceFormat: true,
})

// Grant Bookmark Schema
export const bookmarkSchema = z.object({
  grantOpportunityId: z.number().int().min(1),
  notes: z.string().optional(),
})

export const createBookmarkSchema = bookmarkSchema

// Document Schema
export const documentSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.number().int().optional(),
  fileName: z.string().min(1).max(500),
  fileType: z.string().optional(),
  fileSize: z.number().int().min(0).optional(),
  fileUrl: z.string().url(),
  category: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const createDocumentSchema = documentSchema.pick({
  entityType: true,
  entityId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  fileUrl: true,
  category: true,
  description: true,
  tags: true,
})

// Grant Opportunity Schema
export const grantOpportunitySchema = z.object({
  title: z.string().min(1).max(500),
  organization: z.string().min(1).max(300),
  description: z.string().min(1),
  amount: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  deadline: z.string().datetime().optional(),
  category: z.string().min(1),
  focusAreas: z.array(z.string()).optional(),
  eligibility: z.string().optional(),
  geographicScope: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['Open', 'Closed', 'Upcoming']).default('Open'),
  matchScore: z.number().optional(),
  sourceUrl: z.string().url().optional(),
  applicationUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  requirements: z.string().optional(),
  guidelines: z.string().optional(),
})

export const createGrantOpportunitySchema = grantOpportunitySchema.pick({
  title: true,
  organization: true,
  description: true,
  amount: true,
  minAmount: true,
  maxAmount: true,
  deadline: true,
  category: true,
  focusAreas: true,
  eligibility: true,
  geographicScope: true,
  location: true,
  status: true,
  matchScore: true,
  sourceUrl: true,
  applicationUrl: true,
  contactEmail: true,
  contactPhone: true,
  requirements: true,
  guidelines: true,
})

// Password Change Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
})

// Delete Account Schema
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z.literal('DELETE MY ACCOUNT'),
})

// Session ID Schema
export const sessionIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

// Grant Search Schema
export const grantSearchSchema = z.object({
  searchQuery: z.string().min(1),
  filters: z.object({
    focusArea: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    deadline: z.string().optional(),
  }).optional(),
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Genie Session Schemas
export const genieSessionSchema = z.object({
  name: z.string().min(1).max(300),
  genieType: z.enum(['grant_writing', 'donor_meeting', 'newsletter', 'email_management']),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).default('draft'),
  config: z.record(z.string(), z.unknown()).optional(),
  inputData: z.record(z.string(), z.unknown()).optional(),
  outputContent: z.string().optional(),
  outputMetadata: z.record(z.string(), z.unknown()).optional(),
  conversationHistory: z.array(z.object({
    role: z.string(),
    content: z.string(),
    timestamp: z.string().optional(),
  })).optional(),
  grantApplicationId: z.number().int().optional(),
  donorId: z.number().int().optional(),
})

export const createGenieSessionSchema = genieSessionSchema.pick({
  name: true,
  genieType: true,
  config: true,
  inputData: true,
  grantApplicationId: true,
  donorId: true,
})

export const updateGenieSessionSchema = genieSessionSchema.partial()

// Genie Execution Schema (for logging executions)
export const genieExecutionSchema = z.object({
  sessionId: z.number().int(),
  inputSnapshot: z.record(z.string(), z.unknown()).optional(),
  outputSnapshot: z.string().optional(),
  durationMs: z.number().int().optional(),
  tokensUsed: z.number().int().optional(),
  status: z.enum(['success', 'error', 'partial']).default('success'),
  errorMessage: z.string().optional(),
})

// Export types
export type GrantApplication = z.infer<typeof grantApplicationSchema>
export type CreateGrantApplication = z.infer<typeof createGrantApplicationSchema>
export type UpdateGrantApplication = z.infer<typeof updateGrantApplicationSchema>

export type ComplianceItem = z.infer<typeof complianceItemSchema>
export type CreateComplianceItem = z.infer<typeof createComplianceItemSchema>
export type UpdateComplianceItem = z.infer<typeof updateComplianceItemSchema>

export type Donor = z.infer<typeof donorSchema>
export type CreateDonor = z.infer<typeof createDonorSchema>
export type UpdateDonor = z.infer<typeof updateDonorSchema>

export type DonorMeetingSession = z.infer<typeof donorMeetingSessionSchema>
export type CreateDonorMeetingSession = z.infer<typeof createDonorMeetingSessionSchema>

export type Bookmark = z.infer<typeof bookmarkSchema>
export type CreateBookmark = z.infer<typeof createBookmarkSchema>

export type Document = z.infer<typeof documentSchema>
export type CreateDocument = z.infer<typeof createDocumentSchema>

export type GrantOpportunity = z.infer<typeof grantOpportunitySchema>
export type CreateGrantOpportunity = z.infer<typeof createGrantOpportunitySchema>

export type ChangePassword = z.infer<typeof changePasswordSchema>
export type SessionId = z.infer<typeof sessionIdSchema>

export type GrantSearch = z.infer<typeof grantSearchSchema>
export type Pagination = z.infer<typeof paginationSchema>

export type GenieSession = z.infer<typeof genieSessionSchema>
export type CreateGenieSession = z.infer<typeof createGenieSessionSchema>
export type UpdateGenieSession = z.infer<typeof updateGenieSessionSchema>
export type GenieExecution = z.infer<typeof genieExecutionSchema>
