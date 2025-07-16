-- Migration: Form Builder Enhancements
-- Adds autosave, collaboration, and session management features
-- Date: 2025-01-15

-- Extend form_templates table with new fields for collaboration and autosave
ALTER TABLE form_templates ADD COLUMN user_name TEXT;
ALTER TABLE form_templates ADD COLUMN summary TEXT;
ALTER TABLE form_templates ADD COLUMN lock_hash TEXT;
ALTER TABLE form_templates ADD COLUMN last_saved DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE form_templates ADD COLUMN draft_id TEXT;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_form_templates_draft_id ON form_templates(draft_id);
CREATE INDEX IF NOT EXISTS idx_form_templates_lock_hash ON form_templates(lock_hash);
CREATE INDEX IF NOT EXISTS idx_form_templates_last_saved ON form_templates(last_saved);

-- Create form_sessions table for autosave and real-time collaboration
CREATE TABLE IF NOT EXISTS form_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    template_id INTEGER,
    user_name TEXT NOT NULL,
    session_data TEXT, -- JSON blob containing form state
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    form_title TEXT,
    form_category TEXT,
    FOREIGN KEY (template_id) REFERENCES form_templates (id) ON DELETE CASCADE
);

-- Create indexes for form_sessions table
CREATE INDEX IF NOT EXISTS idx_form_sessions_session_id ON form_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_form_sessions_template_id ON form_sessions(template_id);
CREATE INDEX IF NOT EXISTS idx_form_sessions_expires_at ON form_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_form_sessions_user_name ON form_sessions(user_name);
CREATE INDEX IF NOT EXISTS idx_form_sessions_active ON form_sessions(is_active);

-- Create trigger to update the updated_at field on form_sessions
CREATE TRIGGER IF NOT EXISTS update_form_sessions_updated_at
    AFTER UPDATE ON form_sessions
    FOR EACH ROW
BEGIN
    UPDATE form_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create view for active form sessions with template info
CREATE VIEW IF NOT EXISTS active_form_sessions AS
SELECT 
    fs.session_id,
    fs.user_name,
    fs.created_at,
    fs.updated_at,
    fs.expires_at,
    fs.form_title,
    fs.form_category,
    ft.name as template_name,
    ft.category as template_category,
    ft.clinical_context
FROM form_sessions fs
LEFT JOIN form_templates ft ON fs.template_id = ft.id
WHERE fs.is_active = TRUE 
AND fs.expires_at > CURRENT_TIMESTAMP;

-- Insert sample data for testing (optional - can be removed in production)
-- This creates a test session that expires in 24 hours
INSERT OR IGNORE INTO form_sessions (
    session_id, 
    user_name, 
    session_data, 
    expires_at,
    form_title,
    form_category
) VALUES (
    'test_session_001',
    'TestUser',
    '{"components": [], "isDraft": true, "version": 1}',
    datetime('now', '+1 day'),
    'Test Form Session',
    'Development'
);

-- Comments for documentation
-- Note: Schema version tracking removed due to D1 PRAGMA restrictions