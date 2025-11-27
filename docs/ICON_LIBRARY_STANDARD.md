# Icon Library Standardization Guide

## Decision: Feather Icons (react-icons/fi) as Standard

**Date:** October 26, 2025  
**Status:** ✅ Approved  
**Priority:** High

---

## Summary

The HeadspaceGenie.ai application will standardize on **Feather Icons** (`react-icons/fi`) as the primary icon library across all pages and components.

---

## Current State

The application currently uses **mixed icon libraries**:

- **Feather Icons** (`react-icons/fi`) - Used in landing page, some dashboard components
- **Material Design Icons** (`react-icons/md`) - Used in dashboard, compliance tracker

**Files with Mixed Icons:**
- [`app/dashboard/page.tsx`](app/dashboard/page.tsx:1) - Uses both `md` and `fi`
- [`app/compliance-tracker/page.tsx`](app/compliance-tracker/page.tsx:1) - May use mixed icons
- Other component files (to be audited)

---

## Rationale

### Why Feather Icons?

1. **Visual Consistency**: Feather icons have a clean, minimal, and modern aesthetic that aligns with the HeadspaceGenie.ai brand
2. **Current Usage**: Already used extensively in the landing page and core components
3. **Stroke-based Design**: Consistent stroke widths create visual harmony
4. **Comprehensive Library**: Covers all use cases needed in the application
5. **Performance**: Lightweight and tree-shakeable

### Benefits of Standardization

- **Brand Cohesion**: Consistent visual language across marketing and app
- **Reduced Bundle Size**: Eliminates need for multiple icon libraries
- **Easier Maintenance**: Single source of truth for icon selection
- **Improved UX**: Predictable and familiar iconography

---

## Migration Plan

### Phase 1: Documentation (Complete)
- ✅ Add comments to files using mixed icons
- ✅ Create this standardization guide

### Phase 2: Icon Mapping (To Do)
Map Material Design icons to Feather equivalents:

| Material Design (md) | Feather (fi) | Usage |
|---------------------|-------------|--------|
| `MdDescription` | `FiFileText` | Document/grant icons |
| `MdCalendarToday` | `FiCalendar` | Calendar/date icons |
| `MdSearch` | `FiSearch` | Search functionality |
| `MdAdd` | `FiPlus` | Add/create actions |
| `MdNotifications` | `FiBell` | Notification icons |
| `MdCheckCircle` | `FiCheckCircle` | Success/completion |
| `MdTrendingUp` | `FiTrendingUp` | Analytics/growth |

### Phase 3: Implementation (To Do)
1. Update [`app/dashboard/page.tsx`](app/dashboard/page.tsx:1)
2. Update [`app/compliance-tracker/page.tsx`](app/compliance-tracker/page.tsx:1)
3. Audit and update all other components
4. Remove unused `react-icons/md` imports
5. Test visual consistency across all pages

---

## Implementation Guidelines

### ✅ Do's

```typescript
// ✅ CORRECT: Use Feather Icons
import { FiFileText, FiCalendar, FiSearch } from 'react-icons/fi'

<Icon as={FiFileText} boxSize={5} color="purple.600" />
```

### ❌ Don'ts

```typescript
// ❌ INCORRECT: Don't use Material Design icons
import { MdDescription, MdCalendarToday } from 'react-icons/md'

// ❌ INCORRECT: Don't mix icon libraries
import { FiSearch } from 'react-icons/fi'
import { MdAdd } from 'react-icons/md'
```

---

## Icon Size Standards

Based on [`theme/tokens.ts`](theme/tokens.ts:1) component standards:

| Context | Size | boxSize Prop |
|---------|------|--------------|
| Small actions/inline | 16px | `boxSize={4}` |
| Standard UI elements | 20px | `boxSize={5}` |
| Medium emphasis | 24px | `boxSize={6}` |
| Large feature icons | 32px | `boxSize={8}` |
| Hero/marketing | 48px+ | `boxSize={12}` |

---

## Testing Checklist

After migration, verify:

- [ ] All icons render correctly across all pages
- [ ] Visual consistency maintained (stroke width, sizing)
- [ ] No console warnings about missing icons
- [ ] Bundle size reduced (check build output)
- [ ] Accessibility: Icon labels/aria-labels present
- [ ] Mobile responsiveness maintained

---

## Future Considerations

### Custom Icon Support
If Feather Icons don't cover a specific use case:
1. Create custom SVG icon matching Feather's stroke-based style
2. Document the custom icon in this guide
3. Consider contributing back to react-icons if broadly useful

### Icon System Evolution
- Consider creating a wrapper component for consistent icon usage
- Implement icon color tokens in [`theme/tokens.ts`](theme/tokens.ts:1)
- Add icon size presets for common use cases

---

## References

- **Feather Icons**: https://feathericons.com/
- **react-icons Documentation**: https://react-icons.github.io/react-icons/
- **UI/UX Audit Report**: [`UI_UX_AUDIT_REPORT.md`](UI_UX_AUDIT_REPORT.md:1) - Issue #16

---

**Maintained by:** Kilo Code  
**Last Updated:** October 26, 2025