# TanStack Query SSR Implementation Guide

## Current Status

**What We Have:**
- ✅ TanStack Query configured on client-side
- ✅ Query hooks (`useQuery`, `useMutation`) working
- ✅ Proper query invalidation on mutations
- ✅ React Query DevTools enabled

**What We're Missing:**
- ❌ Server-side data prefetching
- ❌ HydrationBoundary for SSR
- ❌ Server Components for initial data fetch
- ❌ Optimized loading states

## Current Architecture

All pages are **Client Components** (`'use client'`):
- Data fetches **after** page loads on client
- No SSR/SSG benefits
- Slower initial page load
- Content flashes on load

## Recommended Architecture

### Option 1: Full SSR with Server Components (Recommended)

**Dashboard Server Component Example:**
```tsx
// app/dashboard/page.tsx (Server Component - no 'use client')
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { QueryProvider } from '@/lib/providers/QueryProvider'
import { prefetchDashboardStats, prefetchGrantApplications, prefetchCompliance, prefetchRecentActivity } from '@/lib/providers/server-prefetch'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const queryClient = await prefetchDashboardStats()
  await prefetchGrantApplications()
  
  // Get user to prefetch user-specific data
  const { user } = await getAuth()
  if (user) {
    await prefetchCompliance(user.id)
    await prefetchRecentActivity(user.id)
  }

  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardClient />
      </HydrationBoundary>
    </QueryProvider>
  )
}
```

**Client Component Wrapper:**
```tsx
// app/dashboard/dashboard-client.tsx
'use client'

import { useDashboardStats, useGrantApplications } from '@/lib/api/dashboard'
// ... rest of component logic
```

### Option 2: Hybrid Approach (Current + Optimizations)

Keep client components but add:
- Loading states
- Suspense boundaries
- Optimistic updates
- Better error handling

## Implementation Benefits

### With SSR:
- ✅ **Faster initial load** - Data ready on first render
- ✅ **Better SEO** - Content in HTML
- ✅ **Reduced loading states** - Less spinner flashing
- ✅ **Better UX** - Instant content display

### Current (Client-only):
- ✅ Simple implementation
- ✅ Works everywhere
- ❌ Slower initial load
- ❌ Loading spinners on every page
- ❌ No SEO benefits for dynamic content

## Files Created

1. **`lib/providers/server-prefetch.ts`** - Server-side prefetching utilities
2. **`lib/providers/QueryProvider.tsx`** - Updated with SSR helpers

## Next Steps

1. **Choose approach** - Full SSR or keep client-side
2. **Convert pages** - Start with Dashboard page
3. **Test performance** - Measure improvements
4. **Add Suspense** - For better loading UX

## Migration Path

**Phase 1: Critical Pages (Week 1)**
- Dashboard
- Grant Applications List
- Compliance Tracker

**Phase 2: Secondary Pages (Week 2)**
- Profile
- Grant Search
- Settings

**Phase 3: Optimize (Week 3)**
- Add Suspense boundaries
- Optimize query keys
- Add prefetching for navigation

