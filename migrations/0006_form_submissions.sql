-- Migration number: 0006 Form Submissions
-- Patient form submissions with scoring and file attachments

-- Form submissions table for patient responses
CREATE TABLE form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    template_version INTEGER NOT NULL DEFAULT 1,
    patient_id INTEGER NOT NULL,
    clinician_id INTEGER,
    session_id TEXT, -- For grouping related submissions
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'reviewed', 'archived')),
    -- JSON storage for form responses
    form_data TEXT NOT NULL, -- JSON: field responses
    -- Calculated scores from form responses
    calculated_score REAL,
    score_interpretation TEXT,
    -- Metadata and tracking
    metadata TEXT, -- JSON: completion_time, device_info, etc.
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES form_templates(id),
    FOREIGN KEY (patient_id) REFERENCES customers(id),
    FOREIGN KEY (clinician_id) REFERENCES customers(id),
    FOREIGN KEY (reviewed_by) REFERENCES customers(id)
);

-- Form submission attachments for file uploads
CREATE TABLE form_submission_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    field_id TEXT NOT NULL, -- Form field that contains the attachment
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- Cloudflare R2 object key
    upload_status TEXT NOT NULL DEFAULT 'pending' CHECK(upload_status IN ('pending', 'uploaded', 'failed', 'deleted')),
    uploaded_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions(id),
    FOREIGN KEY (uploaded_by) REFERENCES customers(id)
);

-- Form submission notes for clinician observations
CREATE TABLE form_submission_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'general' CHECK(note_type IN ('general', 'clinical', 'administrative', 'follow_up')),
    is_private BOOLEAN NOT NULL DEFAULT false, -- Private to clinician vs visible to patient
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions(id),
    FOREIGN KEY (created_by) REFERENCES customers(id)
);

-- Form submission status history for audit trail
CREATE TABLE form_submission_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by INTEGER NOT NULL,
    change_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions(id),
    FOREIGN KEY (changed_by) REFERENCES customers(id)
);

-- Create indexes for performance
CREATE INDEX idx_form_submissions_template ON form_submissions(template_id);
CREATE INDEX idx_form_submissions_patient ON form_submissions(patient_id);
CREATE INDEX idx_form_submissions_clinician ON form_submissions(clinician_id);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_session ON form_submissions(session_id);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX idx_form_submissions_reviewed_by ON form_submissions(reviewed_by);

CREATE INDEX idx_form_submission_attachments_submission ON form_submission_attachments(submission_id);
CREATE INDEX idx_form_submission_attachments_status ON form_submission_attachments(upload_status);

CREATE INDEX idx_form_submission_notes_submission ON form_submission_notes(submission_id);
CREATE INDEX idx_form_submission_notes_created_by ON form_submission_notes(created_by);
CREATE INDEX idx_form_submission_notes_type ON form_submission_notes(note_type);

CREATE INDEX idx_form_submission_status_history_submission ON form_submission_status_history(submission_id);
CREATE INDEX idx_form_submission_status_history_changed_by ON form_submission_status_history(changed_by);

-- Sample data removed for production deployment
-- INSERT statements would reference non-existent customer and template records