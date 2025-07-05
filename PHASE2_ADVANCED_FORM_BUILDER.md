# Phase 2: Advanced Form Builder - Implementation Plan

## Overview
Building on the solid Phase 1 database foundation, Phase 2 implements a comprehensive clinical form builder interface with template management, component library, and advanced form building capabilities.

## Architecture Overview
- **Frontend**: Astro + React + Tailwind components
- **Backend**: Cloudflare Workers + D1 Database
- **API Layer**: RESTful endpoints with clinical role-based access
- **Database**: Extends Phase 1 schema (no additional migrations needed)

## Implementation Components

### 1. Service Layer Extensions
**Files to Create:**
- `src/lib/services/form_template.ts` - Form template CRUD operations
- `src/lib/services/form_submission.ts` - Submission processing
- `src/lib/services/clinical_permissions.ts` - Role-based access control
- `src/lib/services/form_analytics.ts` - Analytics and reporting

### 2. API Endpoints
**Files to Create:**
- `src/pages/api/form-templates.ts` - Template CRUD
- `src/pages/api/form-templates/[id].ts` - Individual template operations
- `src/pages/api/form-templates/[id]/versions.ts` - Version management
- `src/pages/api/form-submissions.ts` - Submission handling
- `src/pages/api/form-submissions/[id].ts` - Individual submissions
- `src/pages/api/form-categories.ts` - Category management

### 3. UI Components
**Files to Create:**
- `src/components/form-builder/` - Form builder components
  - `FormBuilder.tsx` - Main form builder interface
  - `ComponentPalette.tsx` - Draggable form components
  - `FormPreview.tsx` - Live form preview
  - `PropertyPanel.tsx` - Component property editor
- `src/components/clinical/` - Clinical-specific components
  - `ClinicalFormWrapper.tsx` - Clinical context wrapper
  - `PermissionGuard.tsx` - Role-based component access
  - `ScoreCalculator.tsx` - Score calculation interface

### 4. Form Builder Pages
**Files to Create:**
- `src/pages/forms/` - Form management pages
  - `index.astro` - Form templates listing
  - `new.astro` - Create new form template
  - `[id]/edit.astro` - Edit form template
  - `[id]/preview.astro` - Preview form
  - `[id]/analytics.astro` - Form analytics
- `src/pages/clinical/` - Clinical user interface
  - `dashboard.astro` - Clinical dashboard
  - `forms/` - Clinical form interfaces

### 5. Data Models & Types
**Files to Create:**
- `src/lib/types/` - TypeScript definitions
  - `form-template.ts` - Form template interfaces
  - `form-submission.ts` - Submission interfaces
  - `clinical.ts` - Clinical role definitions
  - `form-components.ts` - Form component definitions

## Phase 2 Features

### Template Management
- ✅ **Create Templates** - Rich form builder interface
- ✅ **Version Control** - Template versioning with parent-child relationships
- ✅ **Category Organization** - Organize templates by clinical categories
- ✅ **Template Library** - Reusable template components
- ✅ **Publishing Workflow** - Draft → Review → Published states

### Form Builder Interface
- ✅ **Drag & Drop Builder** - Visual form construction
- ✅ **Component Palette** - Pre-built clinical form components
- ✅ **Live Preview** - Real-time form preview
- ✅ **Conditional Logic** - Advanced branching and field dependencies
- ✅ **Validation Rules** - Custom validation for clinical data
- ✅ **Scoring Configuration** - Clinical scoring algorithms

### Clinical Components Library
- **Patient Information** - Name, DOB, MRN fields
- **Assessment Scales** - Likert scales, rating scales
- **Clinical Questions** - Yes/No, multiple choice, text
- **Scoring Components** - Auto-calculated scores
- **Date/Time Components** - Appointment scheduling, timestamps
- **File Uploads** - Document attachments
- **Signature Fields** - Digital consent/signatures

### Advanced Features
- **Template Inheritance** - Extend existing templates
- **Multi-page Forms** - Complex multi-step assessments
- **Auto-save** - Draft saving during form building
- **Collaboration** - Multi-user template editing
- **Export/Import** - Template sharing between systems
- **API Integration** - External system connections

## Implementation Schedule

### Week 1: Service Layer & API Foundation
- Day 1-2: Form template service & API endpoints
- Day 3-4: Form submission service & processing
- Day 5: Clinical permissions & role management

### Week 2: Core Form Builder
- Day 1-2: Basic form builder interface
- Day 3-4: Component palette & drag/drop
- Day 5: Form preview & property editing

### Week 3: Advanced Features
- Day 1-2: Conditional logic & validation
- Day 3-4: Scoring configuration
- Day 5: Template versioning UI

### Week 4: Clinical Integration
- Day 1-2: Clinical role-based interfaces
- Day 3-4: Analytics dashboard
- Day 5: Testing & optimization

## Technical Specifications

### Form Template JSON Structure
```json
{
  "version": "2.0",
  "metadata": {
    "title": "Depression Assessment (PHQ-9)",
    "description": "Patient Health Questionnaire-9",
    "clinical_codes": ["ICD-10: Z13.89"],
    "scoring_algorithm": "phq9_standard"
  },
  "pages": [
    {
      "id": "page_1",
      "title": "Patient Information",
      "components": [
        {
          "id": "patient_name",
          "type": "text_input",
          "label": "Patient Name",
          "required": true,
          "validation": {
            "min_length": 2,
            "max_length": 100
          }
        }
      ]
    }
  ],
  "conditional_logic": [
    {
      "condition": "patient_age >= 18",
      "show": ["adult_questions"],
      "hide": ["pediatric_questions"]
    }
  ],
  "scoring": {
    "algorithm": "sum",
    "components": ["q1", "q2", "q3"],
    "interpretation": {
      "0-4": "Minimal depression",
      "5-9": "Mild depression",
      "10-14": "Moderate depression",
      "15-19": "Moderately severe",
      "20-27": "Severe depression"
    }
  }
}
```

### API Response Examples
```typescript
// GET /api/form-templates
{
  "templates": [
    {
      "id": 1,
      "title": "PHQ-9 Depression Screen",
      "category": "Mental Health",
      "version": "1.2",
      "status": "published",
      "created_by": "Dr. Smith",
      "last_modified": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "per_page": 10
  }
}

// POST /api/form-submissions
{
  "template_id": 1,
  "patient_id": "MRN-12345",
  "responses": {
    "q1": 2,
    "q2": 1,
    "q3": 3
  },
  "metadata": {
    "completion_time": 180,
    "submitted_via": "web"
  }
}
```

## Security & Compliance
- **Role-based Access** - Clinical roles (patient, clinician, admin, researcher)
- **Audit Trails** - Complete change tracking for all templates
- **Data Validation** - Clinical data validation and sanitization
- **HIPAA Compliance** - Patient data protection measures
- **Secure API** - Token-based authentication with rate limiting

## Testing Strategy
- **Unit Tests** - Service layer and utility functions
- **Integration Tests** - API endpoints and database operations
- **E2E Tests** - Form builder workflow testing
- **Clinical Validation** - Healthcare professional review and testing

## Success Metrics
- **Template Creation Time** - < 10 minutes for standard forms
- **Form Completion Rate** - > 85% completion rate
- **User Adoption** - 90% of clinicians using form builder within 30 days
- **Performance** - < 2 second form load times
- **Accuracy** - 99.9% scoring calculation accuracy

---

**Status**: Ready for implementation
**Dependencies**: Phase 1 database schema (✅ Complete)
**Target Completion**: 4 weeks from start date