-- StudyFlow Initial Seed Data

-- Demo Student
INSERT INTO users (id, nim, name, major, faculty, semester, university, password_hash)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '220101034',
    'Fajar Pratama',
    'Teknik Informatika',
    'Fakultas Ilmu Komputer',
    5,
    'Universitas Indonesia',
    'mahasiswa123'
) ON CONFLICT (nim) DO NOTHING;

-- Courses
INSERT INTO courses (id, user_id, code, name, lecturer, sks, day, start_time, end_time, room, color, target_grade)
VALUES
    ('c001bc99-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'IF2102', 'Pemrograman Web Modern', 'Dr. Aris Subagyo, M.Kom', 3, 'Senin', '08:00', '10:30', 'Labkom Web (R.302)', 'blue', 'A'),
    ('c002bc99-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'IF2104', 'Basis Data & SQL Terdistribusi', 'Prof. Maya Indriati, Ph.D', 3, 'Selasa', '10:00', '12:30', 'R. Teater Sains A', 'emerald', 'A'),
    ('c003bc99-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'IF2107', 'Algoritma & Struktur Data', 'Ir. Hendra Gunawan, M.T.', 4, 'Rabu', '13:00', '16:30', 'Labkom Algoritma 2', 'violet', 'A'),
    ('c004bc99-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KU2011', 'Etika Profesi & Kepemimpinan', 'Dra. Lestari Utami, M.Si', 2, 'Kamis', '09:00', '10:40', 'Gedung Kuliah Bersama 405', 'amber', 'AB')
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO tasks (id, user_id, course_id, title, description, category, priority, status, due_date, due_time)
VALUES
    ('t001bc99-9c0b-4ef8-bb6d-6bb9bd380101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c002bc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Laporan Praktikum Query Optimization', 'Bandingkan waktu eksekusi query dengan dan tanpa index pada dataset 100.000 row.', 'laporan', 'urgent', 'in_progress', CURRENT_DATE + INTERVAL '1 day', '23:59'),
    ('t002bc99-9c0b-4ef8-bb6d-6bb9bd380102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c001bc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Proyek Akhir Web: Implementasi Autentikasi', 'Implementasi arsitektur REST API dan integrasi token JWT.', 'proyek', 'high', 'todo', CURRENT_DATE + INTERVAL '3 days', '17:00')
ON CONFLICT DO NOTHING;
