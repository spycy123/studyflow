# Database Layer — StudyFlow

Modul ini mengelola skema relasional, indeks performa, migrasi versi, dan data benih (seed) untuk StudyFlow.

## Target Database
- **Engine:** PostgreSQL 15+
- **Dialek Kompatibel:** SQLite (dengan penyesuaian tipe UUID dan timestamps)

## Struktur Entitas Relasional
- `users`: Data akun mahasiswa terautentikasi (NIM, Nama, Prodi, Semester, Password Hash).
- `courses`: Jadwal mata kuliah semester aktif, SKS, dosen, hari, jam, dan target nilai.
- `tasks`: Penugasan kuliah, praktikum, ujian, proyek dengan status siklus hidup (`todo`, `in_progress`, `review`, `done`).
- `subtasks`: Daftar periksa sub-tugas penunjang.
- `task_attachments`: Tautan referensi akademik eksternal (LMS, repositori, drive).

## Eksekusi Manual
```bash
# Inisialisasi skema
psql -U postgres -d studyflow -f schema.sql

# Muat data awal pengujian
psql -U postgres -d studyflow -f seeds.sql
```
