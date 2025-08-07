-- Migration: Create PDF Annotations Table
-- Description: Store PDF annotations for documents
-- Date: 2025-01-07

-- Create pdf_annotations table
CREATE TABLE IF NOT EXISTS pdf_annotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pdf_url TEXT NOT NULL,
  user_id TEXT,
  annotations TEXT NOT NULL,
  metadata TEXT, -- Additional metadata like document title, page count, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_pdf_url ON pdf_annotations(pdf_url);
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_user_id ON pdf_annotations(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_annotations_updated_at ON pdf_annotations(updated_at DESC);

-- Create a trigger to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_pdf_annotations_timestamp 
AFTER UPDATE ON pdf_annotations
BEGIN
  UPDATE pdf_annotations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;