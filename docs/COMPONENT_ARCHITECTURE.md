# Component Architecture Guide

## Layout Components

### Standard Layout Component
**Use:** [`components/layout/MainLayout.tsx`](components/layout/MainLayout.tsx)

This is the standard layout component for all authenticated pages in the application.

#### Features
- Responsive sidebar navigation
- Header with user menu
- Main content area with proper spacing
- Mobile-friendly hamburger menu
- Consistent padding and spacing using theme tokens

#### Usage
```tsx
import { MainLayout } from '@/components/layout/MainLayout'

export default function MyPage() {
  return (
    <MainLayout>
      {/* Your page content here */}
    </MainLayout>
  )
}
```

#### Previous Architecture Notes
- `components/AppLayout.tsx` has been removed in favor of `MainLayout.tsx`
- All pages should use `MainLayout.tsx` for consistency
- Do not create new layout components without discussion

---

## Sidebar Component

**Location:** [`components/layout/Sidebar.tsx`](components/layout/Sidebar.tsx)

The sidebar provides navigation for all main application features.

#### Current Implementation
- Uses props drilling for state management (mobile menu open/close)
- Navigation items defined inline with icons from `react-icons/fi`

#### Future Improvements
- **TODO:** Refactor to use React Context for mobile menu state management
- **TODO:** Consider extracting navigation items to a configuration file
- **TODO:** Add analytics tracking for navigation events

---

## UI Components

All reusable UI components are located in [`components/ui/`](components/ui/).

### Component Standards

#### Loading States
- **Spinner:** Use [`LoadingSpinner`](components/ui/LoadingSpinner.tsx) for inline loading
- **Skeleton:** Use [`LoadingSkeleton`](components/ui/LoadingSkeleton.tsx) for content placeholders

#### Feedback Components
- **Empty States:** Use [`EmptyState`](components/ui/EmptyState.tsx) for empty data states
- **Error Boundaries:** Wrap components with [`ErrorBoundary`](components/ui/ErrorBoundary.tsx)
- **Toasts:** Use [`toast()`](lib/utils/toast.ts) utility for notifications

#### Form Components
- Import from Chakra UI v3: `@chakra-ui/react`
- Use Chakra's native form components with theme tokens

---

## Design System Integration

### Theme Tokens
All spacing, colors, and typography should use tokens from [`theme/tokens.ts`](theme/tokens.ts).

#### Spacing
```tsx
// ✅ Good - using theme tokens
<Box padding={spacing.md} gap={spacing.sm}>

// ❌ Bad - arbitrary values
<Box padding="20px" gap="12px">
```

#### Typography
```tsx
// ✅ Good - using theme headings
<Heading size="h1">

// ❌ Bad - arbitrary sizes
<Heading fontSize="32px">
```

### Icon System
Follow the standards in [`ICON_LIBRARY_STANDARD.md`](ICON_LIBRARY_STANDARD.md):
- Use Feather Icons (`react-icons/fi`) as primary library
- Lucide React for specialized cases only
- Document any new icon additions

---

## State Management

### Current Approach
- **Authentication:** [`AuthContext`](contexts/AuthContext.tsx) - React Context
- **Server State:** React Query via [`lib/query/`](lib/query/)
- **Component State:** React `useState` and props

### Future Considerations
- Evaluate Context API for shared UI state (sidebar, modals, etc.)
- Consider Zustand or similar for complex client state if needed

---

## File Organization

### Page Structure
```
app/
├── [feature]/
│   ├── page.tsx           # Main page component
│   └── [sub-feature]/
│       └── page.tsx       # Sub-page
```

### Component Structure
```
components/
├── layout/                # Layout components (MainLayout, Sidebar)
├── ui/                    # Reusable UI components
└── [feature]/             # Feature-specific components
```

---

## Best Practices

### Component Creation
1. **Single Responsibility:** Each component should have one clear purpose
2. **Props Interface:** Always define TypeScript interfaces for props
3. **Theme Integration:** Use theme tokens for all styling
4. **Accessibility:** Include ARIA labels, keyboard navigation, focus states
5. **Error Handling:** Wrap async components with ErrorBoundary

### Code Style
1. **Import Order:** React → Third-party → Local components → Utils → Types
2. **Naming:** PascalCase for components, camelCase for functions/variables
3. **File Naming:** PascalCase for component files, kebab-case for utilities

### Performance
1. **Lazy Loading:** Use `React.lazy()` for route-based code splitting
2. **Memoization:** Use `React.memo()` for expensive renders
3. **Query Optimization:** Leverage React Query caching strategies

---

## Migration Notes

### Chakra UI v3
See [`CHAKRA_V3_MIGRATION_GUIDE.md`](CHAKRA_V3_MIGRATION_GUIDE.md) for complete migration details.

Key changes:
- New imports from `@chakra-ui/react`
- Updated component APIs
- Theme token structure changes

---

## Related Documentation

- [Design System Summary](PHASE2_DESIGN_SYSTEM_SUMMARY.md)
- [Loading States](PHASE2_LOADING_STATES_SUMMARY.md)
- [Icon Standards](ICON_LIBRARY_STANDARD.md)
- [UI/UX Audit Report](UI_UX_AUDIT_REPORT.md)