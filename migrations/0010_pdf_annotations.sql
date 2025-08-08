-- Migration: Create PDF Annotations Table
-- Description: Store PDF annotations for documents
-- Date: 2025-01-07
-- Updated: 2025-01-08 - Simplified for Cloudflare D1 compatibility

-- Drop existing table if it exists (for clean migration)
DROP TABLE IF EXISTS pdf_annotations;

-- Create pdf_annotations table with the required schema
CREATE TABLE IF NOT EXISTS pdf_annotations (
  id TEXT PRIMARY KEY,
  pdf_id TEXT NOT NULL,
  data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance on pdf_id
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_pdf_id ON pdf_annotations(pdf_id);

-- Create index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_created_at ON pdf_annotations(created_at DESC);