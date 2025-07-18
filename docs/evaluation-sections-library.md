# Evaluation Sections Library Documentation

## Overview

The Evaluation Sections Library provides pre-configured, drag-and-drop evaluation modules for the IPLC form builder. These sections are based on standardized evaluation forms and can be easily integrated into custom forms.

## Architecture

### Key Components

1. **EvaluationSectionsModule** (`src/components/form-builder/EvaluationSectionsModule.tsx`)
   - Main module that displays evaluation sections in the form builder
   - Implements filtering by discipline (SLP, OT, Both)
   - Groups sections by category
   - Handles drag-and-drop functionality

2. **evaluation-sections-config.json** (`src/components/form-builder/evaluation-sections-config.json`)
   - Contains configuration for all 8 evaluation sections
   - Defines fields, field types, and section metadata

3. **FormBuilder Integration** (`src/components/form-builder/FormBuilder.tsx`)
   - Renders evaluation section components when dropped
   - Supports all field types including the new AI Summary field

## Available Sections

### 1. Initial Evaluation Section
- **Category**: Initial Assessment
- **Discipline**: Both
- **Fields**: Date, setting, referral source, reason for referral, background information

### 2. Cognitive-Linguistic Evaluation
- **Category**: Cognitive Assessment
- **Discipline**: SLP
- **Fields**: Attention, concentration, memory assessment, executive function skills

### 3. Motor Skills Evaluation
- **Category**: Motor Assessment
- **Discipline**: OT
- **Fields**: Fine motor skills, gross motor skills, clinical observations

### 4. Communication Evaluation
- **Category**: Communication Assessment
- **Discipline**: SLP
- **Fields**: Receptive language, expressive language, speech production

### 5. ADL/IADL Evaluation
- **Category**: Functional Assessment
- **Discipline**: OT
- **Fields**: Basic ADLs, instrumental ADLs, adaptive equipment

### 6. Standardized Testing Results
- **Category**: Testing Results
- **Discipline**: Both
- **Fields**: Repeating group for test results with scores and observations

### 7. Clinical Impressions & Recommendations
- **Category**: Summary
- **Discipline**: Both
- **Fields**: Strengths, areas of concern, clinical impressions, **AI Summary**, diagnoses, recommendations

### 8. Reassessment/Progress Review
- **Category**: Progress Monitoring
- **Discipline**: Both
- **Fields**: Progress summary, goal tracking, updated recommendations

## AI Summary Integration

The Clinical Impressions section now includes an AI Summary field that:

- **Location**: Clinical Impressions & Recommendations section
- **Configuration**:
  - `autoSelectFields`: false (manual field selection)
  - `includeMedicalContext`: true
  - `maxLength`: 500 characters
  - `sourceFieldLabels`: true
  - `preselectedFields`: ["strengths", "areas_of_concern", "clinical_impressions"]

### How it Works

1. When the Clinical Impressions section is dropped into a form, it includes the AI Summary field
2. Users can click "Select Fields" to choose which fields to summarize
3. The AI generates a summary based on the selected fields
4. The summary can be edited and customized as needed

## Field Types Supported

- `text` - Single line text input
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `date` - Date picker
- `number` - Numeric input
- `rating_scale` - Likert scale ratings
- `rating_grid` - Grid of rating options
- `checkbox_group` - Multiple selection checkboxes
- `assistance_grid` - Grid for assistance levels
- `repeating_group` - Dynamic field groups
- `section_header` - Section titles
- `subsection` - Subsection dividers
- `ai_summary` - AI-powered field summary

## Usage

### Adding Evaluation Sections

1. Click on the "Evaluation Sections" tab in the form builder
2. Filter by discipline if needed (SLP, OT, or Both)
3. Browse sections grouped by category
4. Drag and drop sections into the form canvas
5. Edit field values as needed

### Editing After Drop

- All fields are editable after being dropped into the form
- Click on any field to modify its properties
- Field values are stored in the component's `fieldValues` property

### Creating Form Variants

The system supports multiple form variants through:
- Discipline-specific filtering
- Customizable field properties after drop
- Ability to mix and match sections from different disciplines

## Technical Implementation

### Component Structure

```typescript
interface EvaluationSectionComponent {
  type: 'evaluation_section';
  id: string;
  sectionId: string;
  label: string;
  category: string;
  discipline: string;
  description: string;
  fieldValues: Record<string, any>;
  sectionData?: EvaluationSection;
}
```

### Integration Points

1. **ComponentCollection**: Evaluation sections register as special component types
2. **ComponentRenderer**: Handles rendering of evaluation section fields
3. **FormBuilder**: Manages state and updates for evaluation components
4. **SortableJS**: Provides drag-and-drop functionality

## Best Practices

1. **Field Selection**: Choose appropriate evaluation sections based on client needs
2. **Customization**: Edit field labels and properties after dropping to fit specific requirements
3. **AI Summary**: Use the AI Summary feature in Clinical Impressions for automated documentation
4. **Discipline Filtering**: Use the discipline filter to quickly find relevant sections

## Future Enhancements

- Additional evaluation section templates
- Custom section builder
- Export/import of custom evaluation sections
- Advanced AI integration for other sections