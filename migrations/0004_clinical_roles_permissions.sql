-- Migration number: 0004 Clinical Roles and Permissions
-- Extend customers table for clinical roles and add permission system

-- Extend customers table for clinical functionality
-- Note: These columns already exist in the database from a previous partial migration
-- ALTER TABLE customers ADD COLUMN role TEXT NOT NULL DEFAULT 'patient'
--     CHECK(role IN ('patient', 'clinician', 'admin', 'researcher'));
-- ALTER TABLE customers ADD COLUMN license_number TEXT;
-- ALTER TABLE customers ADD COLUMN organization TEXT;
-- ALTER TABLE customers ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
--     CHECK(status IN ('active', 'inactive', 'suspended'));
-- ALTER TABLE customers ADD COLUMN last_login_at TIMESTAMP;

-- Clinical permissions table for role-based access control
CREATE TABLE clinical_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    permission TEXT NOT NULL,
    resource TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, permission, resource)
);

-- Insert default clinical permissions
INSERT INTO clinical_permissions (role, permission, resource) VALUES
-- Clinician permissions
('clinician', 'create', 'form_templates'),
('clinician', 'read', 'form_templates'),
('clinician', 'update', 'form_templates'),
('clinician', 'delete', 'own_templates'),
('clinician', 'create', 'form_submissions'),
('clinician', 'read', 'form_submissions'),
('clinician', 'update', 'form_submissions'),
('clinician', 'read', 'patient_data'),
('clinician', 'create', 'assessments'),
('clinician', 'read', 'assessments'),
-- Admin permissions (inherits all clinician permissions plus more)
('admin', 'create', 'form_templates'),
('admin', 'read', 'form_templates'),
('admin', 'update', 'form_templates'),
('admin', 'delete', 'form_templates'),
('admin', 'create', 'form_submissions'),
('admin', 'read', 'form_submissions'),
('admin', 'update', 'form_submissions'),
('admin', 'delete', 'form_submissions'),
('admin', 'manage', 'users'),
('admin', 'read', 'analytics'),
('admin', 'manage', 'permissions'),
('admin', 'manage', 'organizations'),
('admin', 'export', 'all_data'),
('admin', 'configure', 'system'),
-- Researcher permissions (read-only analytics focus)
('researcher', 'read', 'form_templates'),
('researcher', 'read', 'form_submissions'),
('researcher', 'read', 'analytics'),
('researcher', 'export', 'analytics'),
('researcher', 'read', 'aggregated_data'),
('researcher', 'create', 'research_queries'),
-- Patient permissions (limited to own data)
('patient', 'create', 'form_submissions'),
('patient', 'read', 'own_submissions'),
('patient', 'update', 'own_submissions'),
('patient', 'read', 'own_profile'),
('patient', 'update', 'own_profile');

-- Create index for permission lookups
CREATE INDEX idx_clinical_permissions_role ON clinical_permissions(role);
CREATE INDEX idx_clinical_permissions_resource ON clinical_permissions(resource);