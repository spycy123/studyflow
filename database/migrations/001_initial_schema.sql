-- Migration: 001_initial_schema
-- Created at: 2026-11-11
-- Description: Create initial tables for users, courses, tasks, subtasks, and task_attachments

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(64) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema') ON CONFLICT DO NOTHING;
