-- Migration number: 0009 Enhanced Form Templates
-- Enhanced metadata and template management capabilities

-- Add new metadata columns to form_templates table
ALTER TABLE form_templates ADD COLUMN tags TEXT; -- JSON array of tags
ALTER TABLE form_templates ADD COLUMN subcategory TEXT;
ALTER TABLE form_templates ADD COLUMN clinical_codes TEXT; -- JSON array of clinical codes
ALTER TABLE form_templates ADD COLUMN target_audience TEXT; -- JSON array of target audiences
ALTER TABLE form_templates ADD COLUMN estimated_completion_time INTEGER; -- minutes
ALTER TABLE form_templates ADD COLUMN change_log TEXT;
ALTER TABLE form_templates ADD COLUMN previous_version_id INTEGER;
ALTER TABLE form_templates ADD COLUMN deprecation_date TIMESTAMP;
ALTER TABLE form_templates ADD COLUMN is_public BOOLEAN DEFAULT false;
ALTER TABLE form_templates ADD COLUMN shareable_link TEXT;
ALTER TABLE form_templates ADD COLUMN logo_position TEXT CHECK(logo_position IN ('top-left', 'top-right', 'top-center')) DEFAULT 'top-left';
ALTER TABLE form_templates ADD COLUMN custom_styling TEXT; -- JSON object for custom styling
ALTER TABLE form_templates ADD COLUMN collaborators TEXT; -- JSON array of collaborators
ALTER TABLE form_templates ADD COLUMN usage_stats TEXT; -- JSON object for usage statistics

-- Add foreign key constraint for previous_version_id
-- Note: SQLite doesn't support adding foreign keys to existing tables, so we'll handle this in application logic

-- Create indexes for new columns to optimize queries
CREATE INDEX idx_form_templates_tags ON form_templates(tags);
CREATE INDEX idx_form_templates_subcategory ON form_templates(subcategory);
CREATE INDEX idx_form_templates_clinical_codes ON form_templates(clinical_codes);
CREATE INDEX idx_form_templates_target_audience ON form_templates(target_audience);
CREATE INDEX idx_form_templates_completion_time ON form_templates(estimated_completion_time);
CREATE INDEX idx_form_templates_is_public ON form_templates(is_public);
CREATE INDEX idx_form_templates_previous_version ON form_templates(previous_version_id);
CREATE INDEX idx_form_templates_deprecation_date ON form_templates(deprecation_date);

-- Update existing templates with default values for new columns
UPDATE form_templates SET 
    tags = '[]',
    target_audience = '[]',
    clinical_codes = '[]',
    is_public = false,
    logo_position = 'top-left',
    custom_styling = '{}',
    collaborators = '[]',
    usage_stats = '{"totalSubmissions": 0, "popularityScore": 0}'
WHERE tags IS NULL;

-- Create template collections tables as specified in architecture
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

-- Create indexes for collection tables
CREATE INDEX idx_form_template_collections_created_by ON form_template_collections(created_by);
CREATE INDEX idx_form_template_collections_organization ON form_template_collections(organization);
CREATE INDEX idx_form_template_collections_is_public ON form_template_collections(is_public);

CREATE INDEX idx_form_template_collection_items_collection ON form_template_collection_items(collection_id);
CREATE INDEX idx_form_template_collection_items_template ON form_template_collection_items(template_id);
CREATE INDEX idx_form_template_collection_items_added_by ON form_template_collection_items(added_by);

-- Sample data for testing (can be removed in production)
-- Sample collection
INSERT INTO form_template_collections (name, description, created_by, organization, is_public) 
VALUES ('Clinical Assessment Forms', 'Standard clinical assessment forms for routine use', 1, 'IPLC', true);