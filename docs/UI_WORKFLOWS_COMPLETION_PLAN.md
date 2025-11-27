# UI Workflows Completion Plan

## Executive Summary
After a comprehensive audit of all UI workflows, I've identified several incomplete interactions that need implementation. This document outlines exactly what needs to be completed and the implementation plan.

---

## Workflows Status Overview

### ✅ **COMPLETE Workflows**
1. **Grant Search** - Fully functional
   - ✅ Search & filtering works
   - ✅ Sorting works (relevance, deadline, amount, recent)
   - ✅ Pagination works
   - ✅ Bookmark functionality works
   - ✅ Filter chips with clear all works
   - ✅ Keyboard shortcuts work
   - ✅ Empty states work
   - ✅ Loading states work

2. **Compliance Tracker** - Fully functional
   - ✅ Upload button shows toast notifications
   - ✅ Filtering by status works
   - ✅ Tab navigation works
   - ✅ Empty states for overdue/pending tasks
   - ✅ Loading skeletons work

3. **Dashboard** - Fully functional
   - ✅ Stats display works
   - ✅ Recent activity works
   - ✅ Charts display works
   - ✅ Navigation to other pages works

---

## ❌ **INCOMPLETE Workflows** (Need Implementation)

###  1. Notifications Page (`app/notifications/page.tsx`)

**Missing Functionality:**

#### A. "Mark All Read" Button (Line 117-120)
- **Current State:** Button exists but does nothing
- **Needed:**
  - Add read/unread state management
  - Update all notifications to read when clicked
  - Show toast confirmation
  - Update notification count in sidebar

#### B. "View Notification Details" Button (Lines 164-166, 217-219)
- **Current State:** Button exists but doesn't navigate
- **Needed:**
  - Create notification detail modal/page
  - Add click handler to show full notification
  - Include action buttons (mark read, delete, etc.)

#### C. "Save Preferences" Button (Line 286-288)
- **Current State:** Only updates local state, doesn't persist
- **Needed:**
  - Add API call to `/api/user/preferences`
  - Persist email/push/SMS notification settings
  - Show success toast
  - Handle errors gracefully

#### D. Filter Functionality (Lines 94-121)
- **Current State:** Dropdowns change state but don't filter
- **Needed:**
  - Filter notifications by type (Critical/Updates/Info)
  - Filter by date range (7/30/90 days, all time)
  - Update displayed notifications based on filters

---

### 2. Profile & Settings Pages

#### Profile Page (`app/profile/page.tsx`)

**Missing Functionality:**

#### A. "Save Changes" Button (Lines 69-72, 274-276)
- **Current State:** Only console.logs data, doesn't persist
- **Needed:**
  - Add API call to `/api/user/profile`
  - Update user data in database
  - Show success toast notification
  - Handle validation errors

#### B. "Change Photo" Button (Lines 100-103)
- **Current State:** Button exists but doesn't work
- **Needed:**
  - Add file upload dialog
  - Handle image upload to `/api/upload`
  - Update avatar image
  - Show upload progress

#### Settings Page (`app/settings/page.tsx`)

**Missing Functionality:**

#### A. "Save Changes" Buttons (Lines 244-246, 343-344, 452-453)
- **Current State:** Buttons exist but don't persist
- **Needed:**
  - Personal Info: Call `/api/user/profile`
  - Organization: Call `/api/user/organization`
  - Notifications: Call `/api/user/preferences`
  - Show success/error toasts

#### B. "Update Password" Button (Line 501-503)
- **Current State:** Button exists but doesn't work
- **Needed:**
  - Add password validation
  - Call `/api/user/change-password`
  - Verify current password
  - Show success/error messages

#### C. "Revoke Session" Button (Line 557-559, 632-634)
- **Current State:** Button exists but doesn't revoke
- **Needed:**
  - Call `/api/user/sessions/revoke`
  - Remove session from active sessions list
  - Show confirmation dialog
  - Show success toast

#### D. "Delete Account" Button (Line 581-583, 645-647)
- **Current State:** Button exists but doesn't delete
- **Needed:**
  - Show confirmation modal with password verification
  - Call `/api/user/delete-account`
  - Sign user out
  - Redirect to landing page

---

### 3. Donor Meeting Genie Workflow

**Files:**
- `app/genies/donor-meeting/page.tsx`
- `app/genies/donor-meeting/summary/page.tsx`
- `app/genies/donor-meeting/practice/page.tsx`

**Missing Functionality:**

#### A. Form → Summary Navigation (donor-meeting/page.tsx Line 39-41)
- **Current State:** "Start Practice Session" button navigates directly to practice
- **Needed:**
  - Should navigate to `/genies/donor-meeting/summary` first
  - Pass form data through URL params or context
  - Validate required fields before navigating

#### B. Summary → Practice Navigation (summary/page.tsx Line 214)
- **Current State:** Button exists and navigates correctly
- **Status:** ✅ **WORKING**

#### C. Practice Session AI Integration (practice/page.tsx Lines 42-50)
- **Current State:** sendMessage function is defined but not fully implemented
- **Needed:**
  - Connect to `/api/ai/donor-practice` endpoint
  - Send user messages and receive AI responses
  - Update conversation history
  - Handle loading/error states

#### D. Session Data Persistence
- **Current State:** Form data is in Zustand store but not persisted
- **Needed:**
  - Save session config to `/api/donor-sessions`
  - Load previous sessions
  - Export session transcripts

---

### 4. Resources Page (`app/resources/page.tsx`)

**Missing Functionality:**

#### A. AI Chat Integration (Lines 44-59)
- **Current State:** Simulates AI response with setTimeout
- **Needed:**
  - Connect to `/api/ai/chat` endpoint
  - Send messages to AI
  - Stream responses
  - Handle errors

#### B. Template Downloads (Lines 201-215)
- **Current State:** Template items exist but don't download
- **Needed:**
  - Add click handlers to download templates
  - Generate PDF/DOCX files
  - Trigger file download

#### C. "Advanced Filters" & "Saved Searches" (Lines 361-368)
- **Current State:** Buttons exist but don't do anything
- **Needed:**
  - Create advanced filters modal
  - Create saved searches management UI
  - Persist saved searches to API

---

## Implementation Priority

### Phase 1: Critical User Flows (High Priority)
1. ✅ Profile/Settings save functionality - Users need to save their data
2. ✅ Notifications mark as read - Users need to manage notifications
3. ✅ Donor Meeting Genie workflow - Core feature navigation

### Phase 2: Secondary Features (Medium Priority)
4. Password change functionality
5. AI chat integration (Resources page)
6. Template downloads

### Phase 3: Nice-to-Have (Low Priority)
7. Session management (revoke sessions)
8. Advanced filters/saved searches
9. Account deletion

---

## Technical Implementation Notes

### API Endpoints Needed
- ✅ `/api/user/profile` - GET/PATCH user profile
- ✅ `/api/user/preferences` - GET/PATCH notification preferences
- ✅ `/api/user/organization` - GET/PATCH organization details
- ❌ `/api/user/change-password` - POST password change
- ❌ `/api/user/sessions` - GET active sessions
- ❌ `/api/user/sessions/revoke` - POST revoke session
- ❌ `/api/user/delete-account` - DELETE account
- ❌ `/api/donor-sessions` - POST/GET donor meeting sessions
- ✅ `/api/ai/chat` - POST AI chat messages (already exists)
- ✅ `/api/ai/donor-practice` - POST donor practice messages (already exists)

### Toast Notifications
All save actions should show:
- Success toast: "Changes saved successfully"
- Error toast: "Failed to save changes. Please try again."
- Loading state: Button shows "Saving..." while processing

### Form Validation
- Email validation
- Password strength requirements
- Required field validation
- Phone number format validation

---

## Success Criteria

### How to verify workflows are complete:
1. ✅ All "Save" buttons persist data and show success toast
2. ✅ All navigation flows work end-to-end
3. ✅ All buttons have working click handlers
4. ✅ Error states are handled gracefully
5. ✅ Loading states are shown during async operations
6. ✅ No console errors in browser
7. ✅ Build completes successfully
8. ✅ All TypeScript type checks pass

---

## Next Steps

1. Implement notification read/unread state management
2. Add API persistence for profile/settings
3. Complete donor meeting genie navigation flow
4. Add toast notifications for all save actions
5. Test all workflows end-to-end
6. Document any remaining edge cases

---

**Last Updated:** 2025-01-26
**Status:** Ready for Implementation
