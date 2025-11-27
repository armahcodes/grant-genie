# Pre-Deployment Testing Checklist

**Project:** HeadspaceGenie.ai (Grant Genie)  
**Version:** 1.0.0  
**Date:** October 26, 2025  
**Status:** Ready for Testing

---

## Overview

This comprehensive checklist ensures the HeadspaceGenie.ai application is thoroughly tested and validated before production deployment. All 47 UI/UX issues have been resolved - this document guides the validation process.

**Related Documentation:**
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md:1) - Complete overhaul details
- [UI_UX_AUDIT_REPORT.md](UI_UX_AUDIT_REPORT.md:1) - Original audit findings

---

## Pre-Testing Setup

### Environment Configuration

- [ ] **Environment Variables Set**
  - [ ] Database connection string configured
  - [ ] API keys and secrets added
  - [ ] Authentication provider credentials set
  - [ ] File storage configuration verified
  - [ ] Email service credentials configured
  - [ ] Analytics tracking IDs added

- [ ] **Dependencies Installed**
  ```bash
  npm install
  # Verify no vulnerabilities
  npm audit
  ```

- [ ] **Database Migrations Run**
  ```bash
  npm run db:migrate
  # Verify schema is up to date
  npm run db:verify
  ```

- [ ] **Build Successful**
  ```bash
  npm run build
  # Verify no errors
  npm run type-check
  ```

- [ ] **Development Server Running**
  ```bash
  npm run dev
  # Accessible at http://localhost:3000
  ```

---

## 1. Accessibility Testing (WCAG 2.1 AA Compliance)

### Automated Testing Tools

- [ ] **axe DevTools Browser Extension**
  - [ ] Install extension ([Chrome](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/))
  - [ ] Scan landing page (`/`)
  - [ ] Scan dashboard (`/dashboard`)
  - [ ] Scan grant search (`/grant-search`)
  - [ ] Scan grant application (`/grant-application`)
  - [ ] Scan compliance tracker (`/compliance-tracker`)
  - [ ] Scan all AI Genie pages
  - [ ] Scan settings page (`/settings`)
  - [ ] **Target:** 0 violations, 0 critical issues

- [ ] **WAVE (Web Accessibility Evaluation Tool)**
  - [ ] Install extension ([WAVE](https://wave.webaim.org/extension/))
  - [ ] Scan all major pages
  - [ ] Check for errors (red icons)
  - [ ] Review alerts (yellow icons)
  - [ ] **Target:** 0 errors

- [ ] **Lighthouse Accessibility Audit**
  - [ ] Run in Chrome DevTools (Performance tab)
  - [ ] Test landing page
  - [ ] Test dashboard
  - [ ] Test main application pages
  - [ ] **Target:** 95+ score on all pages

### Manual Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Tab through all interactive elements
  - [ ] Verify logical tab order
  - [ ] Check focus indicators are visible
  - [ ] Test Skip to main content link
  - [ ] Navigate forms with Tab/Shift+Tab
  - [ ] Activate buttons with Enter and Space
  - [ ] Close modals with Escape key
  - [ ] Test all keyboard shortcuts (`?` for help)

- [ ] **Screen Reader Testing**
  
  **macOS (VoiceOver):**
  - [ ] Enable: Cmd+F5
  - [ ] Navigate pages with VO+Arrow keys
  - [ ] Verify all images have alt text
  - [ ] Check form labels are announced
  - [ ] Verify button purposes are clear
  - [ ] Test landmark navigation (VO+U)
  
  **Windows (NVDA - Free):**
  - [ ] Download from [nvaccess.org](https://www.nvaccess.org/)
  - [ ] Navigate with Insert+Arrow keys
  - [ ] Test forms and inputs
  - [ ] Verify headings structure (Insert+F7)

- [ ] **Color Contrast**
  - [ ] Install [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
  - [ ] Check all text meets 4.5:1 ratio (AA standard)
  - [ ] Check large text meets 3:1 ratio
  - [ ] Test in both light and dark modes
  - [ ] Verify colored badges/indicators have sufficient contrast

- [ ] **Text Scaling**
  - [ ] Zoom to 200% in browser (Cmd/Ctrl + +)
  - [ ] Verify no content is cut off
  - [ ] Check all functionality remains accessible
  - [ ] Verify no horizontal scrolling (except tables)
  - [ ] Test on all major pages

---

## 2. Responsive Design Testing

### Device Testing Matrix

#### Mobile Devices (< 768px)

- [ ] **iPhone SE (320px width)**
  - [ ] Safari (latest)
  - [ ] Landing page renders correctly
  - [ ] Dashboard accessible
  - [ ] Navigation drawer opens/closes
  - [ ] Forms are usable
  - [ ] Buttons are touch-friendly (min 44px)
  - [ ] No horizontal scroll
  - [ ] Text is readable without zoom

- [ ] **iPhone 12/13 Pro (390px)**
  - [ ] Safari (latest)
  - [ ] Chrome for iOS
  - [ ] All features functional
  - [ ] Images load properly
  - [ ] Forms submit successfully

- [ ] **Samsung Galaxy S21 (360px)**
  - [ ] Chrome for Android
  - [ ] Samsung Internet
  - [ ] Test all core flows
  - [ ] Verify touch interactions

#### Tablet Devices (768px - 1024px)

- [ ] **iPad (768px)**
  - [ ] Safari (latest)
  - [ ] Verify layout transitions
  - [ ] Test sidebar behavior
  - [ ] Check table layouts

- [ ] **iPad Pro (1024px)**
  - [ ] Safari (latest)
  - [ ] Chrome for iOS
  - [ ] Verify desktop-like experience

#### Desktop (≥ 1024px)

- [ ] **Laptop (1280px)**
  - [ ] Verify sidebar always visible
  - [ ] Check content centering

- [ ] **Desktop (1920px)**
  - [ ] Verify max-width constraints
  - [ ] Check spacing and layout

- [ ] **Ultra-wide (2560px+)**
  - [ ] Test max-width limits
  - [ ] Verify no excessive stretching

### Orientation Testing

- [ ] **Portrait Mode**
  - [ ] iPhone SE
  - [ ] iPad
  - [ ] All content accessible

- [ ] **Landscape Mode**
  - [ ] iPhone 12 Pro
  - [ ] iPad
  - [ ] Navigation remains usable

---

## 3. Cross-Browser Testing

### Desktop Browsers

- [ ] **Google Chrome (Latest)**
  - [ ] Version: ________
  - [ ] All pages load correctly
  - [ ] Animations smooth
  - [ ] Forms functional
  - [ ] No console errors

- [ ] **Mozilla Firefox (Latest)**
  - [ ] Version: ________
  - [ ] CSS rendering correct
  - [ ] JavaScript features work
  - [ ] Date pickers functional
  - [ ] File uploads work

- [ ] **Safari (Latest - macOS)**
  - [ ] Version: ________
  - [ ] WebKit rendering correct
  - [ ] Animations work
  - [ ] Forms submit properly

- [ ] **Microsoft Edge (Latest)**
  - [ ] Version: ________
  - [ ] Chromium features work
  - [ ] All functionality intact

### Mobile Browsers

- [ ] **Mobile Safari (iOS)**
  - [ ] iOS Version: ________
  - [ ] Touch interactions work
  - [ ] Viewport scaling correct
  - [ ] No zoom issues

- [ ] **Chrome for Android**
  - [ ] Android Version: ________
  - [ ] All features functional

---

## 4. Functional Testing

### Authentication & Authorization

- [ ] **Sign Up Flow**
  - [ ] Navigate to `/auth/signup`
  - [ ] Fill all required fields
  - [ ] Test email validation
  - [ ] Test password strength indicator
  - [ ] Test password confirmation
  - [ ] Submit form
  - [ ] Verify success toast
  - [ ] Verify redirect to dashboard

- [ ] **Sign In Flow**
  - [ ] Navigate to `/auth/signin`
  - [ ] Enter valid credentials
  - [ ] Test "Remember me" checkbox
  - [ ] Verify success toast
  - [ ] Redirect to dashboard
  - [ ] Session persists on refresh

- [ ] **Sign Out**
  - [ ] Click sign out button
  - [ ] Verify redirect to landing
  - [ ] Session cleared
  - [ ] Cannot access protected routes

- [ ] **Protected Routes**
  - [ ] Access `/dashboard` without auth → redirects to `/auth/signin`
  - [ ] All protected pages require authentication

### Dashboard

- [ ] **Page Load**
  - [ ] Shows loading skeleton initially
  - [ ] Data loads within 2 seconds
  - [ ] No empty state errors

- [ ] **Statistics Cards**
  - [ ] Active applications count displayed
  - [ ] Pending tasks count correct
  - [ ] Bookmarked grants count shown
  - [ ] Success rate percentage calculated

- [ ] **Recent Applications Section**
  - [ ] Lists up to 5 recent applications
  - [ ] Shows empty state if no applications
  - [ ] "View All" button navigates correctly
  - [ ] Application cards show correct status badges

- [ ] **Quick Actions**
  - [ ] "Discover Grants" → `/grant-search`
  - [ ] "Start Writing" → `/grant-application`
  - [ ] Buttons have correct sizes

### Grant Search

- [ ] **Search Functionality**
  - [ ] Enter search term
  - [ ] Results filter based on query
  - [ ] Empty search shows all grants
  - [ ] Loading skeleton displays

- [ ] **Filters**
  - [ ] Funding amount range slider works
  - [ ] Category checkboxes filter results
  - [ ] Deadline filter applies
  - [ ] "Clear Filters" resets all

- [ ] **Grant Cards**
  - [ ] Grant title, funder, amount displayed
  - [ ] Deadline badge shows correct color
  - [ ] Bookmark button works (toggle on/off)
  - [ ] Bookmark toast notification appears
  - [ ] "View Details" navigates correctly
  - [ ] "Start Application" navigates correctly

### Grant Application

- [ ] **Form Load**
  - [ ] All fields render correctly
  - [ ] Required fields marked with *
  - [ ] Help text displayed

- [ ] **Real-Time Validation**
  - [ ] Required field errors show on blur
  - [ ] Email format validated
  - [ ] Number fields accept only numbers
  - [ ] Error messages are field-specific

- [ ] **File Upload**
  - [ ] Click upload area → file picker opens
  - [ ] Drag and drop file → file accepted
  - [ ] File name displays after upload
  - [ ] File size limit enforced
  - [ ] Invalid file type rejected
  - [ ] Success toast on upload

- [ ] **Form Submission**
  - [ ] Cannot submit with errors
  - [ ] Submit button shows loading spinner
  - [ ] Success toast appears
  - [ ] Redirect to applications list

### Compliance Tracker

- [ ] **Desktop Table View (≥768px)**
  - [ ] Table displays all columns
  - [ ] Status badges colored correctly
  - [ ] Action buttons functional
  - [ ] Overdue tasks highlighted in red

- [ ] **Mobile Card View (<768px)**
  - [ ] Cards stack vertically
  - [ ] All information visible
  - [ ] Touch-friendly buttons (44px+)
  - [ ] No horizontal scroll

---

## 5. Loading States & Error Handling

### Loading States

- [ ] **Page-Level Loading**
  - [ ] Dashboard shows skeleton loader
  - [ ] Grant search shows skeleton cards
  - [ ] Loading doesn't block navigation

- [ ] **Component Loading**
  - [ ] Button spinners during actions
  - [ ] Upload spinner during file upload
  - [ ] Inline spinners in sections

- [ ] **Skeleton Loaders**
  - [ ] Dashboard stats skeleton (4 cards)
  - [ ] Grant cards skeleton (5 cards)
  - [ ] Skeletons animate (pulse effect)

### Error Boundaries

- [ ] **Page Error Boundary**
  - [ ] Shows friendly error message
  - [ ] "Refresh Page" button works
  - [ ] "Go Home" button works

- [ ] **Section Error Boundary**
  - [ ] Error in one section doesn't crash page
  - [ ] "Try Again" button reloads section

### Toast Notifications

- [ ] **Success Toasts**
  - [ ] Grant application submitted
  - [ ] File uploaded successfully
  - [ ] Grant bookmarked
  - [ ] Changes saved
  - [ ] Displays for 5 seconds
  - [ ] Can dismiss manually

- [ ] **Error Toasts**
  - [ ] Form submission failed
  - [ ] File upload failed
  - [ ] Network error
  - [ ] Clear error message

---

## 6. Dark Mode Testing

- [ ] **Toggle Functionality**
  - [ ] Find dark mode toggle
  - [ ] Click toggle
  - [ ] Theme switches immediately
  - [ ] Preference saved to localStorage
  - [ ] Persists on page refresh

- [ ] **Visual Testing**
  - [ ] All pages render correctly in dark mode
  - [ ] Text is readable (sufficient contrast)
  - [ ] No white flashes during navigation
  - [ ] Buttons distinguishable
  - [ ] Form inputs styled correctly

---

## 7. Keyboard Shortcuts Testing

- [ ] **Help Modal**
  - [ ] Press `?` key
  - [ ] Shortcuts modal opens
  - [ ] All shortcuts listed
  - [ ] Press `Esc` to close

- [ ] **Navigation Shortcuts**
  - [ ] `g d` - Go to dashboard
  - [ ] `g s` - Go to grant search
  - [ ] `g a` - Go to applications
  - [ ] `g c` - Go to compliance
  - [ ] `g n` - Go to notifications

- [ ] **Platform-Specific**
  - [ ] macOS uses `⌘` key
  - [ ] Windows uses `Ctrl` key

---

## 8. Performance Testing

### Lighthouse Audits

- [ ] **Performance Audit**
  - [ ] Test landing page (`/`)
  - [ ] Test dashboard (`/dashboard`)
  - [ ] Test grant search (`/grant-search`)
  - [ ] **Target Scores:**
    - Performance: 90+
    - Accessibility: 95+
    - Best Practices: 95+
    - SEO: 90+

### Core Web Vitals

- [ ] **Largest Contentful Paint (LCP)**
  - [ ] All pages: < 2.5s

- [ ] **First Input Delay (FID)**
  - [ ] All pages: < 100ms

- [ ] **Cumulative Layout Shift (CLS)**
  - [ ] All pages: < 0.1

---

## 9. Security Testing

### Authentication Security

- [ ] **Password Requirements**
  - [ ] Minimum 8 characters enforced
  - [ ] Requires uppercase letter
  - [ ] Requires lowercase letter
  - [ ] Requires number

- [ ] **Session Management**
  - [ ] Session timeout after inactivity
  - [ ] Session invalidated on sign out

### Input Sanitization

- [ ] **XSS Prevention**
  - [ ] Script tags stripped from inputs
  - [ ] HTML entities escaped

### File Upload Security

- [ ] **File Type Validation**
  - [ ] Only allowed types accepted
  - [ ] Executable files rejected

- [ ] **File Size Limits**
  - [ ] Large files (>10MB) rejected
  - [ ] Error message shown

---

## 10. Pre-Deployment Sign-Off

### Stakeholder Approval

- [ ] **Product Owner Review**
  - [ ] All features implemented
  - [ ] Meets acceptance criteria
  - [ ] Approved for launch

- [ ] **Development Sign-Off**
  - [ ] Code reviewed
  - [ ] Tests passing
  - [ ] No known critical bugs

### Final Checks

- [ ] **Production Environment**
  - [ ] Environment variables configured
  - [ ] Database backed up
  - [ ] SSL certificate valid
  - [ ] Monitoring enabled

- [ ] **Rollback Plan**
  - [ ] Previous version tagged
  - [ ] Rollback procedure documented

---

## Resources

### Testing Tools

- **Accessibility:**
  - [axe DevTools](https://www.deque.com/axe/devtools/)
  - [WAVE](https://wave.webaim.org/)
  - [Lighthouse](https://developers.google.com/web/tools/lighthouse)
  - [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

- **Performance:**
  - [WebPageTest](https://www.webpagetest.org/)
  - Chrome DevTools Performance Panel

- **Cross-Browser:**
  - [BrowserStack](https://www.browserstack.com/)

---

**Checklist Version:** 1.0.0  
**Last Updated:** October 26, 2025  
**Maintained By:** Kilo Code

**Related Documentation:**
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md:1)
- [UI_UX_AUDIT_REPORT.md](UI_UX_AUDIT_REPORT.md:1)
- [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md:1)