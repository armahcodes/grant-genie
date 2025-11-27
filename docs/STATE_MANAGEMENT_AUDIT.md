# State Management Audit Report

## Executive Summary

The application uses **TanStack Query** for server state and **Zustand** for client state, but there are critical issues:
- ❌ **Duplicate stores** causing confusion
- ❌ **State overlap** between Zustand and TanStack Query
- ❌ **Data synchronization** issues
- ⚠️ **Inconsistent patterns** across the codebase

---

## 🔴 Critical Issues

### 1. DUPLICATE USER STORES ⚠️ **HIGH PRIORITY**

**Two different `useUserStore` implementations:**

**File 1:** `lib/store/index.ts`
```typescript
interface UserState {
  userId: string | null
  userEmail: string | null
  userName: string | null
  organizationName: string | null
  setUser: (user: {...}) => void
  clearUser: () => void
}
```
- Simple user identification only
- Persisted to localStorage

**File 2:** `lib/stores/userStore.ts`
```typescript
interface UserState {
  personalInfo: PersonalInfo | null
  organizationInfo: OrganizationInfo | null
  notificationPreferences: NotificationPreferences | null
  isOnboarded: boolean
  onboardingData: {...} | null
  // ... setters
}
```
- Full user profile data
- Also persisted to localStorage with different key

**Problem:**
- Two stores with same name but different data structures
- Creates naming conflicts
- Import confusion (which one to use?)
- Both try to store user data differently

**Impact:** ⚠️ **HIGH** - Confusion, potential bugs, data inconsistency

---

### 2. DUPLICATE UI STORES ⚠️ **MEDIUM PRIORITY**

**File 1:** `lib/store/index.ts`
```typescript
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

**File 2:** `lib/stores/uiStore.ts`
```typescript
interface UIState {
  isSidebarOpen: boolean
  sidebarCollapsed: boolean
  activeProfileTab: 'personal' | 'organization' | 'notifications' | 'security'
  activeSettingsTab: 'personal' | 'organization' | 'notifications' | 'security'
  isAuthModalOpen: boolean
  authModalType: 'signin' | 'signup' | null
  isLoading: boolean
  loadingMessage: string | null
  // ... more actions
}
```

**Problem:**
- Different property names (`sidebarOpen` vs `isSidebarOpen`)
- Different scope and features
- Potential conflicts

**Impact:** ⚠️ **MEDIUM** - Confusion, inconsistent UI behavior

---

### 3. STATE OVERLAP BETWEEN ZUSTAND & TANSTACK QUERY 🔴 **HIGH PRIORITY**

**Overlapping State:**

| Data Type | Zustand Store | TanStack Query | Conflict? |
|-----------|--------------|----------------|-----------|
| User Profile | `useUserStore` (lib/stores/userStore.ts) | `usePersonalInfo()`, `useOrganizationInfo()` | ✅ YES |
| Grants List | `useGrantsStore` (filters only) | `useGrantApplications()` | ✅ Partial |
| Grant Form Data | `useGrantGenieStore` | `useCreateGrantApplication()` | ⚠️ Acceptable |
| Notifications | `useNotificationStore` (count only) | `useNotifications()` | ✅ Partial |

**Examples of Conflict:**

**Profile Page** (`app/profile/page.tsx`):
```typescript
// TanStack Query - fetches from API
const { data: personalInfo } = usePersonalInfo()
const { data: organizationInfo } = useOrganizationInfo()

// But also syncs to Zustand store
const setPersonalInfo = useUserStore((state) => state.setPersonalInfo)
const setOrganizationInfo = useUserStore((state) => state.setOrganizationInfo)

// In mutation success:
onSuccess: (data) => {
  setPersonalInfo(data) // Updates Zustand
  // But TanStack Query cache is separate!
}
```

**Problem:**
- User profile data exists in TWO places
- Zustand store gets updated on mutations
- But TanStack Query cache is separate
- Can get out of sync
- No single source of truth

**Impact:** 🔴 **CRITICAL** - Data inconsistency, stale data, bugs

---

### 4. UNNECESSARY STATE DUPLICATION ⚠️ **MEDIUM PRIORITY**

**Grant Filters:**
- Zustand: `useGrantsStore` stores filters
- TanStack Query: Filters passed as query keys
- ✅ **OK** - Filters are UI state, not server state

**Grant Form Data:**
- Zustand: `useGrantGenieStore` stores form data
- TanStack Query: `useCreateGrantApplication()` creates grant
- ✅ **OK** - Form data is client state, persists across navigation

**Notifications:**
- Zustand: `useNotificationStore` stores unread count
- TanStack Query: `useNotifications()` fetches full list
- ⚠️ **Partial Issue** - Count can get out of sync

---

## ✅ What's Working Well

### 1. Clear Separation (Where It Exists)
- **Zustand for UI state:** ✅ Filters, form data, sidebar state
- **TanStack Query for server state:** ✅ API data fetching
- **Donor/Grant Genie stores:** ✅ Workflow state (persisted forms)

### 2. Proper Query Invalidation
- Mutations properly invalidate queries
- Cache updates work correctly

### 3. Good Patterns (Selected Examples)
- `useGrantsStore` - UI filters (correct use of Zustand)
- `useGrantGenieStore` - Form persistence (correct use of Zustand)
- `useGrantApplications()` - Server data (correct use of TanStack Query)

---

## 📊 Current State Architecture

### Zustand Stores (Client State)

**✅ Correct Usage:**
- `useGrantsStore` - Grant filters, selections, search history (UI state)
- `useGrantGenieStore` - Grant application form data (workflow state)
- `useDonorGenieStore` - Donor meeting session state (workflow state)
- `useUIStore` (lib/stores/uiStore.ts) - UI state (tabs, modals, sidebar)

**❌ Problematic Usage:**
- `useUserStore` (lib/stores/userStore.ts) - User profile data (should be TanStack Query only)
- `useUserStore` (lib/store/index.ts) - Duplicate, simple user ID (redundant with Stack Auth)
- `useNotificationStore` - Unread count (could sync from TanStack Query)

### TanStack Query (Server State)

**✅ Correct Usage:**
- `useGrantApplications()` - Grants list from API
- `useCompliance()` - Compliance items from API
- `useDashboardStats()` - Dashboard stats from API
- `usePersonalInfo()`, `useOrganizationInfo()` - User profile from API
- `useNotifications()` - Notifications from API

**⚠️ Integration Issues:**
- Mutations update Zustand stores instead of relying on query invalidation
- Some stores duplicate server data unnecessarily

---

## 🎯 Recommendations

### Immediate Actions (Critical)

1. **Consolidate Duplicate Stores**
   - Merge `lib/store/index.ts` and `lib/stores/*` into single structure
   - Remove duplicate `useUserStore` implementations
   - Keep one `useUIStore` with comprehensive interface

2. **Remove Server Data from Zustand**
   - Remove user profile data from `useUserStore` (lib/stores/userStore.ts)
   - Use TanStack Query as single source of truth for server data
   - Keep Zustand only for UI/client state

3. **Fix State Synchronization**
   - Remove Zustand updates from TanStack Query mutation callbacks
   - Let TanStack Query handle all server state
   - Use query invalidation for cache updates

### Refactoring Plan

**Phase 1: Consolidate Stores**
```
lib/stores/
  ├── uiStore.ts          ✅ Keep (UI state)
  ├── grantsStore.ts      ✅ Keep (filters, UI state)
  ├── workflows.ts        ✅ Create (GrantGenie, DonorGenie)
  └── userStore.ts        ❌ Remove (use TanStack Query only)
```

**Phase 2: Remove Server Data from Zustand**
- Remove `personalInfo`, `organizationInfo` from Zustand
- Use `usePersonalInfo()`, `useOrganizationInfo()` exclusively
- Update all components to use TanStack Query hooks

**Phase 3: Sync Notification Count**
- Derive `unreadCount` from TanStack Query `useNotifications()`
- Remove separate Zustand store or sync it

---

## 📋 Store Consolidation Plan

### Proposed Store Structure

**1. UI Store** (`lib/stores/uiStore.ts`)
```typescript
interface UIState {
  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  
  // Active tabs
  activeProfileTab: 'personal' | 'organization' | 'notifications' | 'security'
  activeSettingsTab: 'personal' | 'organization' | 'notifications' | 'security'
  
  // Modals
  authModalOpen: boolean
  authModalType: 'signin' | 'signup' | null
  
  // Theme
  theme: 'light' | 'dark'
}
```
✅ **Keep** - Pure UI state

**2. Grants Store** (`lib/stores/grantsStore.ts`)
```typescript
interface GrantsState {
  filters: GrantFilter
  selectedGrantIds: string[]
  recentSearches: string[]
}
```
✅ **Keep** - UI/filter state

**3. Workflow Store** (`lib/stores/workflows.ts`)
```typescript
interface WorkflowState {
  grantGenie: GrantGenieState
  donorGenie: DonorGenieState
}
```
✅ **Consolidate** - Workflow/form persistence

**4. User Store** → ❌ **REMOVE**
- Use Stack Auth for user identity
- Use TanStack Query for user profile data

---

## 🛠️ Migration Steps

### Step 1: Remove Duplicate Stores
1. Delete `lib/store/index.ts` (or merge into `lib/stores/`)
2. Update all imports to use consolidated stores
3. Fix naming conflicts

### Step 2: Remove Server Data from Zustand
1. Remove `personalInfo`, `organizationInfo` from Zustand
2. Update components to use TanStack Query hooks only
3. Remove Zustand sync code from mutation callbacks

### Step 3: Create Unified Store Structure
1. Consolidate stores into `lib/stores/` directory
2. Export from single entry point
3. Update documentation

---

## 📈 Expected Improvements

**After Refactoring:**
- ✅ Single source of truth for each data type
- ✅ No duplicate stores
- ✅ Clear separation: Zustand = UI state, TanStack Query = Server state
- ✅ Better performance (no duplicate data)
- ✅ Easier to maintain
- ✅ No sync issues

---

## 🔍 Files That Need Changes

**Stores to Consolidate:**
- `lib/store/index.ts` - Merge into `lib/stores/`
- `lib/stores/userStore.ts` - Remove server data
- `lib/stores/uiStore.ts` - Keep, enhance

**Components to Update:**
- `app/profile/page.tsx` - Remove Zustand sync, use TanStack Query only
- `app/dashboard/page.tsx` - Already good (uses TanStack Query)
- `app/grant-search/page.tsx` - Already good (uses both correctly)
- `lib/api/user.ts` - Remove Zustand sync from mutations

**Query Hooks:**
- `lib/api/user.ts` - Remove Zustand store updates
- Other mutation hooks - Review for Zustand sync

