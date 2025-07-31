# IPLC Forms v3 - Testing Checklist

Use this checklist to verify all features are working correctly before production deployment.

## ✅ Pre-Deployment Testing

### 🧪 Core Functionality

#### Form Builder
- [ ] Create a new form with multiple field types
- [ ] Add text, email, phone, date fields
- [ ] Add select, radio, checkbox fields
- [ ] Add file upload field
- [ ] Add AI summary field
- [ ] Save form and verify it appears in form list
- [ ] Edit existing form and save changes
- [ ] Delete a form (test with caution)

#### Conditional Logic
- [ ] Add conditional logic to show/hide fields
- [ ] Test AND conditions (multiple requirements)
- [ ] Test OR conditions (any requirement)
- [ ] Test different operators (equals, contains, greater than, less than)
- [ ] Verify logic works in preview mode
- [ ] Verify logic works in live form

#### Multi-Page Forms
- [ ] Create form with multiple pages
- [ ] Test navigation between pages
- [ ] Verify progress indicator updates
- [ ] Test validation on page transitions
- [ ] Test browser back/forward behavior
- [ ] Verify form state persists across pages

### 💬 Chat Interface

#### Document Upload
- [ ] Upload a PDF document
- [ ] Upload a DOCX document
- [ ] Verify text extraction works
- [ ] Test document deletion
- [ ] Verify uploaded docs appear in drawer

#### Chat Features
- [ ] Ask questions about uploaded documents
- [ ] Verify citation surfaces appear as ^[1]
- [ ] Test hover tooltips on citations
- [ ] Test context window management (long conversations)
- [ ] Create shareable snippet
- [ ] Access snippet via direct link
- [ ] Export conversation as Markdown
- [ ] Export conversation as JSON

### 🔌 Integrations

#### Nextcloud
- [ ] Configure Nextcloud settings in admin panel
- [ ] Submit a form with Nextcloud export enabled
- [ ] Verify form data appears in Nextcloud
- [ ] Test WebDAV connection with PROPFIND

#### Notifications
- [ ] Configure Slack webhook
- [ ] Submit form and verify Slack notification
- [ ] Configure email notifications
- [ ] Submit form and verify email delivery
- [ ] Test webhook integration with custom endpoint

### 🎨 UX/UI

#### Theme & Styling
- [ ] Verify metallic gradient theme applied
- [ ] Check noise texture background visible
- [ ] Test responsive design on mobile
- [ ] Test responsive design on tablet
- [ ] Verify collapsible sidebar works
- [ ] Check smooth transitions/animations
- [ ] Test dark mode compatibility

#### Accessibility
- [ ] Navigate with keyboard only
- [ ] Test with screen reader
- [ ] Verify proper ARIA labels
- [ ] Check color contrast ratios
- [ ] Test form field focus states

### 🚀 Performance

#### Loading & Response Times
- [ ] Measure initial page load time (< 2s)
- [ ] Test form builder responsiveness
- [ ] Verify AI chat responses stream smoothly
- [ ] Check image/file upload performance
- [ ] Test with slow network (throttled)

#### Caching
- [ ] Submit multiple similar queries to test Vectorize cache
- [ ] Verify conversation history loads from cache
- [ ] Test cache invalidation on updates

### 🔒 Security

#### Authentication
- [ ] Test admin login with correct credentials
- [ ] Test admin login with incorrect credentials
- [ ] Verify admin routes are protected
- [ ] Test session timeout behavior

#### Rate Limiting
- [ ] Make 60+ requests in 1 minute
- [ ] Verify rate limit error appears
- [ ] Test burst capacity (10 quick requests)
- [ ] Verify rate limit resets after timeout

#### Security Headers
- [ ] Inspect response headers in DevTools
- [ ] Verify CSP header present
- [ ] Verify HSTS header present
- [ ] Check X-Frame-Options is DENY
- [ ] Test XSS protection

### 📊 Monitoring

#### Metrics & Analytics
- [ ] Access /api/admin/sse-metrics endpoint
- [ ] Verify metrics data is collected
- [ ] Check performance recommendations
- [ ] Test error tracking

#### Logging
- [ ] Check browser console for errors
- [ ] Monitor Cloudflare Workers logs
- [ ] Verify no sensitive data in logs

## 🚨 Production Readiness

### Environment Variables
- [ ] ADMIN_USERNAME set and secure
- [ ] ADMIN_PASSWORD set and strong
- [ ] All integration keys configured
- [ ] No development keys in production

### Database
- [ ] All migrations applied successfully
- [ ] Test database backup procedure
- [ ] Verify data integrity

### Deployment
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting warnings
- [ ] Bundle size is reasonable
- [ ] Deployment succeeds on Cloudflare

## 📝 Post-Deployment

### Smoke Tests
- [ ] Access production URL
- [ ] Create a test form
- [ ] Submit test form
- [ ] Verify chat interface works
- [ ] Check admin panel access

### Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Set up performance monitoring
- [ ] Create backup schedule

## 🐛 Known Issues

Document any known issues or limitations:

1. _None identified at this time_

## 📋 Sign-off

- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] Stakeholders notified
- [ ] Backup created
- [ ] Ready for production

---

**Tested by**: _________________  
**Date**: _________________  
**Version**: 3.0.0  
**Environment**: Production