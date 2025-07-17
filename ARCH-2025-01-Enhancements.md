# Form Builder Enhancements Architecture
## Title/Subtitle Elements, Line Separator, Markdown Support & Enhanced Template Management

**Document Version:** 1.0  
**Date:** January 2025  
**Author:** Architecture Team  

---

## Executive Summary

This document outlines the technical architecture for enhancing the IPLC Forms v3 form builder with new visual elements (Title/Subtitle, Line Separator), Markdown/HTML support, and an improved "Save Template" feature with enhanced management capabilities.

## Current Architecture Analysis

### Database Schema (Existing)
Based on [`migrations/0005_form_templates.sql`](migrations/0005_form_templates.sql):
- **form_templates**: Primary table with JSON `form_config` and `metadata` fields
- **form_template_versions**: Audit trail for version management  
- **form_template_access**: Sharing and permission management
- **Indexes**: Optimized for category, organization, and user queries

### Component Architecture (Existing)
From [`src/lib/api-form-builder.ts`](src/lib/api-form-builder.ts):
```typescript
interface FormComponent {
  id: string;
  type: 'text_input' | 'textarea' | 'select' | ... | 'ai_summary';
  label: string;
  order: number;
  props?: {
    // Component-specific properties
    required?: boolean;
    placeholder?: string;
    description?: string;
    // ... extensive property support
  };
}
```

### Form Builder Patterns (Existing)
From [`src/components/form-builder/FormBuilder.tsx`](src/components/form-builder/FormBuilder.tsx):
- **Drag & Drop**: SortableJS integration with component palette
- **Live Preview**: Real-time form rendering with [`FormPreview.tsx`](src/components/form-builder/FormPreview.tsx)
- **Autosave**: Session-based autosave with [`useFormAutosave`](src/hooks/useFormAutosave.ts)
- **Form Locking**: Collaborative editing with [`useFormLock`](src/hooks/useFormLock.ts)

---

## 1. New Form Builder Elements Architecture

### 1.1 Title/Subtitle Element

#### Component Definition
```typescript
// Extension to existing FormComponent interface
interface TitleSubtitleProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontFamily: 'system' | 'serif' | 'sans-serif' | 'monospace';
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  color: string; // Hex color code
  alignment: 'left' | 'center' | 'right';
  marginTop: number; // px
  marginBottom: number; // px
  enableMarkdown?: boolean; // Optional markdown rendering
}
```

#### Component Registration
**File**: [`src/components/form-builder/ComponentPalette.tsx`](src/components/form-builder/ComponentPalette.tsx)
```typescript
// Add to componentItems array
{
  id: 'title_subtitle',
  type: 'title_subtitle',
  label: 'Title/Subtitle',
  icon: <Heading className="h-4 w-4" />,
  description: 'Configurable heading or subtitle text',
  category: 'Layout'
}
```

#### Renderer Implementation
**File**: `src/components/form-builder/components/TitleSubtitleElement.tsx`
```typescript
interface TitleSubtitleElementProps {
  component: FormComponent;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormComponent>) => void;
}

export const TitleSubtitleElement: React.FC<TitleSubtitleElementProps> = ({
  component,
  isEditing = false,
  onUpdate
}) => {
  const props = component.props as TitleSubtitleProps;
  
  const handleTextChange = (text: string) => {
    onUpdate?.({ 
      label: text, // Update component label
      props: { ...props, text }
    });
  };

  const handleStyleUpdate = (updates: Partial<TitleSubtitleProps>) => {
    onUpdate?.({ props: { ...props, ...updates } });
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <TitleSubtitleEditor
          props={props}
          onTextChange={handleTextChange}
          onStyleUpdate={handleStyleUpdate}
        />
        <TitleSubtitlePreview props={props} />
      </div>
    );
  }

  return <TitleSubtitleRenderer props={props} />;
};
```

#### Property Panel Design
**Features**:
- **Text Input**: Rich text editor with markdown preview
- **Typography Controls**: Font family dropdown, size slider, weight buttons
- **Color Picker**: Hex input with color preview and palette
- **Alignment**: Left/Center/Right radio buttons
- **Spacing**: Margin top/bottom number inputs
- **Level Selector**: H1-H6 semantic heading level

### 1.2 Line Separator Element

#### Component Definition
```typescript
interface LineSeparatorProps {
  thickness: number; // px, 1-10
  color: string; // Hex color
  style: 'solid' | 'dashed' | 'dotted';
  width: number; // percentage, 10-100
  alignment: 'left' | 'center' | 'right';
  marginTop: number; // px
  marginBottom: number; // px
}
```

#### Component Registration
```typescript
{
  id: 'line_separator',
  type: 'line_separator',
  label: 'Line Separator',
  icon: <Minus className="h-4 w-4" />,
  description: 'Visual divider line',
  category: 'Layout'
}
```

#### Implementation
**File**: `src/components/form-builder/components/LineSeparatorElement.tsx`
```typescript
export const LineSeparatorElement: React.FC<LineSeparatorElementProps> = ({
  component,
  isEditing = false,
  onUpdate
}) => {
  const props = component.props as LineSeparatorProps;

  if (isEditing) {
    return (
      <div className="space-y-4">
        <LineSeparatorEditor
          props={props}
          onUpdate={(updates) => onUpdate?.({ props: { ...props, ...updates } })}
        />
        <LineSeparatorPreview props={props} />
      </div>
    );
  }

  return <LineSeparatorRenderer props={props} />;
};
```

### 1.3 Markdown/HTML Support Strategy

#### Library Integration
**Recommended**: [`markdown-it`](https://github.com/markdown-it/markdown-it) with sanitization
```bash
npm install markdown-it @types/markdown-it dompurify @types/dompurify
```

#### Markdown Service
**File**: `src/lib/services/markdown.ts`
```typescript
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

class MarkdownService {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });
  }

  render(markdown: string): string {
    const html = this.md.render(markdown);
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'title']
    });
  }

  renderInline(markdown: string): string {
    const html = this.md.renderInline(markdown);
    return DOMPurify.sanitize(html);
  }
}

export const markdownService = new MarkdownService();
```

#### Usage Integration
- **Title/Subtitle Elements**: Optional markdown rendering toggle
- **Component Descriptions**: Automatic markdown processing
- **Form Instructions**: Rich text support in form metadata

---

## 2. Enhanced Save Template Feature Architecture

### 2.1 Data Schema Refinements

#### Enhanced Metadata Structure
```typescript
interface EnhancedFormTemplateMetadata {
  // Visual settings
  showIplcLogo: boolean;
  logoPosition: 'top-left' | 'top-right' | 'top-center';
  customStyling?: {
    primaryColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  
  // Template management
  tags: string[];
  category: string;
  subcategory?: string;
  clinicalCodes?: string[];
  targetAudience: string[];
  estimatedCompletionTime?: number; // minutes
  
  // Version management
  changeLog?: string;
  previousVersionId?: number;
  deprecationDate?: string;
  
  // Sharing and collaboration
  isPublic: boolean;
  shareableLink?: string;
  collaborators?: Array<{
    userId: number;
    role: 'viewer' | 'editor' | 'admin';
    addedAt: string;
  }>;
  
  // Analytics and usage
  usage: {
    totalSubmissions: number;
    lastUsed?: string;
    popularityScore: number;
  };
}
```

#### Template Collections (New Table)
```sql
-- New table for organizing templates into collections
CREATE TABLE form_template_collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL,
    organization TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES customers(id)
);

CREATE TABLE form_template_collection_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    template_id INTEGER NOT NULL,
    added_by INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES form_template_collections(id),
    FOREIGN KEY (template_id) REFERENCES form_templates(id),
    FOREIGN KEY (added_by) REFERENCES customers(id),
    UNIQUE(collection_id, template_id)
);
```

### 2.2 API Endpoint Specifications

#### Core Template Endpoints (Enhanced)

**GET `/api/form-templates`**
```typescript
// Enhanced query parameters
interface GetTemplatesQuery {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  tags?: string[]; // comma-separated
  created_by?: number;
  organization?: string;
  is_public?: boolean;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'popularity' | 'usage';
  sort_order?: 'asc' | 'desc';
  include_analytics?: boolean;
}

// Enhanced response
interface GetTemplatesResponse {
  templates: FormTemplate[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
  filters_applied: GetTemplatesQuery;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    organizations: Array<{ name: string; count: number }>;
  };
}
```

**POST `/api/form-templates`** (Enhanced)
```typescript
interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  clinical_context?: string;
  schema: {
    components: FormComponent[];
    ui_schema?: any;
  };
  metadata: EnhancedFormTemplateMetadata;
  tags?: string[];
  is_public?: boolean;
  collection_ids?: number[]; // Add to collections
}
```

#### New Template Management Endpoints

**POST `/api/form-templates/:id/duplicate`**
```typescript
interface DuplicateTemplateRequest {
  name: string;
  description?: string;
  include_submissions?: boolean; // Copy submission data
  reset_analytics?: boolean;
}
```

**GET `/api/form-templates/:id/analytics`**
```typescript
interface TemplateAnalyticsResponse {
  template_id: number;
  usage_stats: {
    total_submissions: number;
    unique_users: number;
    avg_completion_time: number;
    completion_rate: number;
    last_30_days_submissions: number;
  };
  field_analytics: Array<{
    field_id: string;
    field_label: string;
    completion_rate: number;
    most_common_responses: any[];
    error_rate: number;
  }>;
  user_feedback?: {
    average_rating: number;
    feedback_count: number;
    recent_comments: string[];
  };
}
```

**GET `/api/form-templates/collections`**
```typescript
interface CollectionsResponse {
  collections: Array<{
    id: number;
    name: string;
    description?: string;
    template_count: number;
    is_public: boolean;
    created_by: {
      id: number;
      name: string;
    };
    created_at: string;
  }>;
}
```

#### Template Import/Export Endpoints

**GET `/api/form-templates/:id/export`**
```typescript
// Query parameters
interface ExportQuery {
  format: 'json' | 'csv' | 'pdf';
  include_submissions?: boolean;
  include_analytics?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}
```

**POST `/api/form-templates/import`**
```typescript
interface ImportTemplateRequest {
  file: File; // JSON or CSV
  options: {
    overwrite_existing?: boolean;
    preserve_ids?: boolean;
    assign_to_collection?: number;
  };
}
```

### 2.3 UI/UX Flow Design

#### Template Browser Interface

**Location**: `src/pages/forms/templates.astro`
**Components**:
```typescript
// Main template browser with enhanced filtering
<TemplateBrowser
  filters={{
    search: string;
    categories: string[];
    tags: string[];
    sortBy: 'popularity' | 'recent' | 'name';
  }}
  view="grid" | "list" | "table"
  onTemplateSelect={(template) => void}
  onTemplateCreate={() => void}
/>

// Template card with enhanced metadata display
<TemplateCard
  template={FormTemplate}
  showAnalytics={boolean}
  onEdit={() => void}
  onDuplicate={() => void}
  onDelete={() => void}
  onShare={() => void}
/>
```

#### Enhanced Form Builder Settings

**Integration**: [`src/components/form-builder/FormBuilder.tsx`](src/components/form-builder/FormBuilder.tsx)
```typescript
// Extended settings dialog
<FormBuilderSettings>
  <TemplateBasicInfo />
  <TemplateMetadata />
  <TemplateStyling />
  <TemplateSharing />
  <TemplateCollections />
  <TemplateAnalytics />
</FormBuilderSettings>
```

#### Template Management Workflow

1. **Creation Flow**:
   - Basic Info → Component Design → Styling Options → Metadata & Tags → Collections → Save & Publish

2. **Edit Flow**:
   - Load Template → Version Comparison → Edit Components → Update Metadata → Save as New Version

3. **Collaboration Flow**:
   - Share Template → Set Permissions → Collaborative Editing → Merge Changes → Publish

4. **Analytics Flow**:
   - View Usage Stats → Field Performance → User Feedback → Export Reports → Optimization Recommendations

---

## 3. Implementation Plan

### 3.1 New Files to Create

#### Form Builder Components
```
src/components/form-builder/components/
├── TitleSubtitleElement.tsx
├── TitleSubtitleEditor.tsx
├── TitleSubtitleRenderer.tsx
├── LineSeparatorElement.tsx
├── LineSeparatorEditor.tsx
└── LineSeparatorRenderer.tsx
```

#### Template Management
```
src/components/template-management/
├── TemplateBrowser.tsx
├── TemplateCard.tsx
├── TemplateFilters.tsx
├── TemplateAnalytics.tsx
├── TemplateCollections.tsx
├── TemplateSettings.tsx
├── TemplateSharing.tsx
└── TemplateImportExport.tsx
```

#### Services and Utilities
```
src/lib/services/
├── markdown.ts
├── template-analytics.ts
└── template-collections.ts

src/lib/utils/
├── template-export.ts
└── template-import.ts
```

#### API Endpoints
```
src/pages/api/form-templates/
├── collections.ts
├── import.ts
├── export.ts
└── [id]/
    ├── analytics.ts
    ├── duplicate.ts
    └── share.ts
```

#### Pages
```
src/pages/forms/
├── templates.astro
├── collections.astro
└── analytics.astro
```

#### Database Migrations
```
migrations/
├── 0009_enhanced_form_templates.sql
└── 0010_template_collections.sql
```

### 3.2 Files Requiring Modification

#### Core Form Builder Files
- [`src/lib/api-form-builder.ts`](src/lib/api-form-builder.ts): Extend FormComponent interface
- [`src/components/form-builder/ComponentPalette.tsx`](src/components/form-builder/ComponentPalette.tsx): Add new component types
- [`src/components/form-builder/FormBuilder.tsx`](src/components/form-builder/FormBuilder.tsx): Component renderer cases
- [`src/components/form-builder/LiveFormRenderer.tsx`](src/components/form-builder/LiveFormRenderer.tsx): Live form rendering

#### API and Services  
- [`src/pages/api/form-templates.ts`](src/pages/api/form-templates.ts): Enhanced CRUD operations
- [`src/lib/services/form_template.ts`](src/lib/services/form_template.ts): Extended service methods
- [`src/lib/schemas/api-validation.ts`](src/lib/schemas/api-validation.ts): New validation schemas

#### UI Components
- [`src/components/form-builder/FormPreview.tsx`](src/components/form-builder/FormPreview.tsx): New element rendering
- Navigation components for template management integration

### 3.3 Development Phases

#### Phase 1: Foundation (Week 1-2)
- [ ] Create markdown service and sanitization
- [ ] Implement TitleSubtitleElement component
- [ ] Implement LineSeparatorElement component  
- [ ] Update ComponentPalette with new elements
- [ ] Basic rendering in FormBuilder and LiveFormRenderer

#### Phase 2: Enhanced Template Management (Week 3-4)
- [ ] Database migration for enhanced metadata
- [ ] Update FormTemplate interface and validation
- [ ] Enhanced API endpoints for templates
- [ ] Template analytics service implementation

#### Phase 3: Advanced Features (Week 5-6)
- [ ] Template collections system
- [ ] Import/export functionality
- [ ] Template sharing and collaboration
- [ ] Advanced template browser UI

#### Phase 4: Polish and Integration (Week 7-8)
- [ ] UI/UX refinements
- [ ] Performance optimizations
- [ ] Comprehensive testing
- [ ] Documentation updates

---

## 4. Technical Considerations

### 4.1 Performance Optimization
- **Lazy Loading**: Template browser with virtual scrolling
- **Caching**: Enhanced caching for template metadata and analytics
- **CDN**: Static asset optimization for template thumbnails
- **Database**: Indexed queries for template search and filtering

### 4.2 Security Considerations
- **Markdown Sanitization**: DOMPurify integration for XSS prevention
- **Template Permissions**: RBAC for template access and modification
- **Data Validation**: Comprehensive validation for new component types
- **Audit Trail**: Enhanced logging for template modifications

### 4.3 Scalability Architecture
- **Component Registry**: Plugin-based architecture for future components
- **Event System**: Template lifecycle events for extensibility
- **API Versioning**: Backward compatibility for template schemas
- **Data Migration**: Versioned migration system for schema updates

### 4.4 Accessibility Standards
- **WCAG 2.1 AA**: Compliant component implementations
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: Configurable high-contrast mode

---

## 5. Success Metrics

### 5.1 Technical Metrics
- **Component Load Time**: < 100ms for new elements
- **Template Search Performance**: < 200ms for filtered results
- **Bundle Size Impact**: < 50KB increase for new features
- **Test Coverage**: > 90% for new components and services

### 5.2 User Experience Metrics
- **Template Creation Time**: 25% reduction in form creation time
- **User Adoption**: 80% of users utilizing new layout elements
- **Template Reuse**: 40% increase in template duplication and sharing
- **Error Reduction**: 30% fewer form configuration errors

### 5.3 Business Metrics
- **Template Library Growth**: 200% increase in active templates
- **Collaboration Usage**: 60% of teams using shared templates
- **Feature Utilization**: 70% adoption rate for new elements
- **Customer Satisfaction**: 4.5+ star rating for new features

---

## Conclusion

This architectural design provides a comprehensive foundation for enhancing the IPLC Forms v3 form builder with powerful new layout elements and advanced template management capabilities. The modular design ensures scalability and maintainability while preserving the existing robust architecture.

The implementation follows established patterns in the codebase, leverages existing infrastructure, and introduces minimal breaking changes. The phased development approach allows for iterative testing and refinement while delivering value throughout the development cycle.

The enhanced template management system positions IPLC Forms as a comprehensive solution for clinical form design, promoting collaboration, standardization, and data-driven optimization of clinical workflows.