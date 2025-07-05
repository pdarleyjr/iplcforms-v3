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

-- Sample data removed for production deployment
-- Form templates will be created through the application interface