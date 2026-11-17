-- Migration: 002_add_user_roles
-- Created at: 2026-11-17
-- Description: Add role column to users table and allow semester 0 for non-student roles

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'mahasiswa' 
            CHECK (role IN ('mahasiswa', 'dosen', 'admin'));
    END IF;
END $$;

INSERT INTO schema_migrations (version) VALUES ('002_add_user_roles') ON CONFLICT DO NOTHING;
