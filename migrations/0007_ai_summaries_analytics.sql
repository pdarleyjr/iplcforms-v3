-- Migration number: 0007 AI Summaries and Analytics
-- AI-powered form analysis and comprehensive analytics tracking

-- AI summaries for form submissions
CREATE TABLE ai_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    summary_type TEXT NOT NULL DEFAULT 'clinical' CHECK(summary_type IN ('clinical', 'risk_assessment', 'progress_note', 'insights')),
    ai_model TEXT NOT NULL, -- e.g., 'claude-3-sonnet', 'gpt-4'
    model_version TEXT NOT NULL,
    -- AI-generated content
    summary_text TEXT NOT NULL,
    key_findings TEXT, -- JSON array of key insights
    risk_indicators TEXT, -- JSON array of risk factors
    recommendations TEXT, -- JSON array of clinical recommendations
    confidence_score REAL, -- 0.0 to 1.0 confidence rating
    -- Processing metadata
    processing_time_ms INTEGER,
    token_usage INTEGER,
    processing_status TEXT NOT NULL DEFAULT 'completed' CHECK(processing_status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
    error_message TEXT,
    -- Clinician feedback on AI output
    clinician_rating INTEGER CHECK(clinician_rating BETWEEN 1 AND 5),
    clinician_feedback TEXT,
    is_clinician_approved BOOLEAN DEFAULT NULL,
    reviewed_by INTEGER,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions(id),
    FOREIGN KEY (reviewed_by) REFERENCES customers(id)
);

-- Form analytics for usage tracking and insights
CREATE TABLE form_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER,
    template_id INTEGER,
    metric_type TEXT NOT NULL CHECK(metric_type IN ('usage', 'completion', 'performance', 'engagement')),
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_unit TEXT, -- e.g., 'count', 'percentage', 'seconds', 'score'
    dimensions TEXT, -- JSON: additional dimensions like user_role, device_type, etc.
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES customers(id),
    FOREIGN KEY (template_id) REFERENCES form_templates(id)
);

-- AI model configuration and performance tracking
CREATE TABLE ai_model_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT NOT NULL UNIQUE,
    model_version TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'anthropic', 'openai', 'cloudflare'
    endpoint_url TEXT,
    -- Model settings
    max_tokens INTEGER DEFAULT 4000,
    temperature REAL DEFAULT 0.3,
    system_prompt TEXT NOT NULL,
    -- Performance tracking
    average_processing_time_ms INTEGER,
    average_token_usage INTEGER,
    success_rate REAL, -- 0.0 to 1.0
    total_requests INTEGER DEFAULT 0,
    failed_requests INTEGER DEFAULT 0,
    -- Configuration metadata
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI processing queue for async operations
CREATE TABLE ai_processing_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    summary_type TEXT NOT NULL,
    model_config_id INTEGER NOT NULL,
    priority INTEGER NOT NULL DEFAULT 5, -- 1 (highest) to 10 (lowest)
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES form_submissions(id),
    FOREIGN KEY (model_config_id) REFERENCES ai_model_configs(id)
);

-- Clinical insights aggregation for dashboard
CREATE TABLE clinical_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER,
    patient_id INTEGER,
    clinician_id INTEGER,
    insight_type TEXT NOT NULL CHECK(insight_type IN ('trend', 'alert', 'recommendation', 'milestone')),
    insight_category TEXT NOT NULL, -- e.g., 'depression', 'anxiety', 'progress'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity_level TEXT CHECK(severity_level IN ('low', 'medium', 'high', 'critical')),
    action_required BOOLEAN NOT NULL DEFAULT false,
    -- Supporting data
    supporting_data TEXT, -- JSON: submission IDs, scores, trends
    confidence_score REAL,
    expires_at TIMESTAMP,
    is_acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by INTEGER,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES customers(id),
    FOREIGN KEY (patient_id) REFERENCES customers(id),
    FOREIGN KEY (clinician_id) REFERENCES customers(id),
    FOREIGN KEY (acknowledged_by) REFERENCES customers(id)
);

-- Create indexes for performance
CREATE INDEX idx_ai_summaries_submission ON ai_summaries(submission_id);
CREATE INDEX idx_ai_summaries_type ON ai_summaries(summary_type);
CREATE INDEX idx_ai_summaries_status ON ai_summaries(processing_status);
CREATE INDEX idx_ai_summaries_reviewed_by ON ai_summaries(reviewed_by);
CREATE INDEX idx_ai_summaries_created_at ON ai_summaries(created_at);

CREATE INDEX idx_form_analytics_template ON form_analytics(template_id);
CREATE INDEX idx_form_analytics_organization ON form_analytics(organization_id);
CREATE INDEX idx_form_analytics_metric_type ON form_analytics(metric_type);
CREATE INDEX idx_form_analytics_date_range ON form_analytics(date_range_start, date_range_end);

CREATE INDEX idx_ai_processing_queue_status ON ai_processing_queue(status);
CREATE INDEX idx_ai_processing_queue_priority ON ai_processing_queue(priority);
CREATE INDEX idx_ai_processing_queue_scheduled_at ON ai_processing_queue(scheduled_at);
CREATE INDEX idx_ai_processing_queue_submission ON ai_processing_queue(submission_id);

CREATE INDEX idx_clinical_insights_organization ON clinical_insights(organization_id);
CREATE INDEX idx_clinical_insights_patient ON clinical_insights(patient_id);
CREATE INDEX idx_clinical_insights_clinician ON clinical_insights(clinician_id);
CREATE INDEX idx_clinical_insights_type ON clinical_insights(insight_type);
CREATE INDEX idx_clinical_insights_severity ON clinical_insights(severity_level);
CREATE INDEX idx_clinical_insights_action_required ON clinical_insights(action_required);

-- Insert default AI model configurations
INSERT INTO ai_model_configs (model_name, model_version, provider, system_prompt) VALUES 
('claude-3-sonnet', '20240229', 'anthropic', 'You are a clinical AI assistant analyzing patient form submissions. Provide concise, professional clinical summaries focusing on key findings, risk indicators, and evidence-based recommendations.'),
('gpt-4-turbo', '2024-04-09', 'openai', 'Analyze this clinical form submission and provide a structured summary with key findings, risk assessment, and clinical recommendations.'),
('llama-3-70b', 'latest', 'cloudflare', 'Generate a clinical summary for this patient form submission, highlighting important findings and potential areas of concern.');

-- Insert sample analytics metrics
INSERT INTO form_analytics (template_id, metric_type, metric_name, metric_value, metric_unit, date_range_start, date_range_end) VALUES 
(1, 'usage', 'total_submissions', 150, 'count', '2024-01-01', '2024-01-31'),
(1, 'completion', 'completion_rate', 0.85, 'percentage', '2024-01-01', '2024-01-31'),
(1, 'performance', 'average_completion_time', 180, 'seconds', '2024-01-01', '2024-01-31');

-- Insert sample clinical insight
INSERT INTO clinical_insights (patient_id, clinician_id, insight_type, insight_category, title, description, severity_level, action_required, supporting_data) VALUES 
(1, 1, 'trend', 'depression', 'Improving Depression Scores', 'Patient shows consistent improvement in PHQ-9 scores over the last 3 assessments', 'low', false, '{"submissions": [1], "trend": "improving", "score_change": -5}');