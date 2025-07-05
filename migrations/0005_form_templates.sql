-- Migration number: 0005 Form Templates
-- Clinical form templates with versioning and JSON configuration

-- Form templates table for dynamic clinical forms
CREATE TABLE form_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('assessment', 'intake', 'progress', 'discharge', 'screening', 'custom')),
    version INTEGER NOT NULL DEFAULT 1,
    parent_template_id INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by INTEGER NOT NULL,
    organization TEXT,
    -- JSON configuration for form structure
    form_config TEXT NOT NULL, -- JSON: fields, validation, scoring
    -- JSON metadata for additional properties
    metadata TEXT, -- JSON: tags, clinical_codes, notes
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES customers(id),
    FOREIGN KEY (parent_template_id) REFERENCES form_templates(id)
);

-- Form template versions audit trail
CREATE TABLE form_template_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    version_number INTEGER NOT NULL,
    form_config TEXT NOT NULL, -- JSON snapshot
    metadata TEXT, -- JSON snapshot
    change_summary TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES form_templates(id),
    FOREIGN KEY (created_by) REFERENCES customers(id),
    UNIQUE(template_id, version_number)
);

-- Form template sharing permissions
CREATE TABLE form_template_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    access_level TEXT NOT NULL CHECK(access_level IN ('read', 'write', 'admin')),
    granted_by INTEGER NOT NULL,
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES form_templates(id),
    FOREIGN KEY (user_id) REFERENCES customers(id),
    FOREIGN KEY (granted_by) REFERENCES customers(id),
    UNIQUE(template_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_form_templates_category ON form_templates(category);
CREATE INDEX idx_form_templates_created_by ON form_templates(created_by);
CREATE INDEX idx_form_templates_organization ON form_templates(organization);
CREATE INDEX idx_form_templates_active ON form_templates(is_active);
CREATE INDEX idx_form_templates_published ON form_templates(is_published);
CREATE INDEX idx_form_templates_parent ON form_templates(parent_template_id);

CREATE INDEX idx_form_template_versions_template ON form_template_versions(template_id);
CREATE INDEX idx_form_template_versions_created_by ON form_template_versions(created_by);

CREATE INDEX idx_form_template_access_template ON form_template_access(template_id);
CREATE INDEX idx_form_template_access_user ON form_template_access(user_id);

-- Insert sample clinical form templates
INSERT INTO form_templates (name, description, category, form_config, metadata, created_by) VALUES
('PHQ-9 Depression Assessment', 'Patient Health Questionnaire-9 for depression screening', 'screening',
 '{"fields":[{"id":"q1","type":"radio","label":"Little interest or pleasure in doing things","options":[{"value":0,"label":"Not at all"},{"value":1,"label":"Several days"},{"value":2,"label":"More than half the days"},{"value":3,"label":"Nearly every day"}],"required":true},{"id":"q2","type":"radio","label":"Feeling down, depressed, or hopeless","options":[{"value":0,"label":"Not at all"},{"value":1,"label":"Several days"},{"value":2,"label":"More than half the days"},{"value":3,"label":"Nearly every day"}],"required":true}],"scoring":{"type":"sum","ranges":[{"min":0,"max":4,"label":"Minimal depression"},{"min":5,"max":9,"label":"Mild depression"},{"min":10,"max":14,"label":"Moderate depression"},{"min":15,"max":19,"label":"Moderately severe depression"},{"min":20,"max":27,"label":"Severe depression"}]}}',
 '{"clinical_codes":["ICD-10:Z13.31"],"tags":["depression","screening","PHQ-9"],"estimated_time":5}',
 1),
('Initial Intake Assessment', 'Comprehensive patient intake form', 'intake',
 '{"fields":[{"id":"presenting_concern","type":"textarea","label":"Primary presenting concern","required":true,"maxLength":500},{"id":"symptom_duration","type":"select","label":"Duration of symptoms","options":[{"value":"days","label":"Days"},{"value":"weeks","label":"Weeks"},{"value":"months","label":"Months"},{"value":"years","label":"Years"}],"required":true},{"id":"previous_treatment","type":"checkbox","label":"Previous mental health treatment","required":false}]}',
 '{"tags":["intake","assessment"],"estimated_time":15}',
 1);