# Dokumentasi Sistem StudyFlow

Selamat datang di pusat dokumentasi resmi **StudyFlow** (*Academic Task & Coursework Management System*). Direktori ini mengorganisasikan seluruh cetak biru arsitektur, panduan peran pengguna dan tim perekayasa, spesifikasi basis data, serta kontrak REST API.

---

##  Struktur Navigasi Dokumentasi

```
docs/
├── README.md                         # Indeks Utama Dokumentasi (Halaman ini)
├── architecture/                     # Desain & Arsitektur Sistem
│   ├── system-architecture.md        # Ikhtisar arsitektur, model C4, diagram alur, dan state machine
│   └── database-erd.md               # Skema relasional, diagram ERD Mermaid, indeks, dan migrasi
├── roles/                            # Dokumentasi Peran & Hak Akses
│   ├── application-roles.md          # Role pengguna aplikasi (Mahasiswa, Dosen, Admin) & Matriks RBAC
│   └── engineering-roles.md          # Pembagian tanggung jawab tim rekayasa monorepo
└── api/                              # Spesifikasi Komunikasi REST API
    └── api-specification.md          # Daftar endpoint REST API v1, format JSON, dan kode status
```

---

##  Ringkasan Bagian Dokumen

### 1. [Arsitektur Sistem (architecture/system-architecture.md)](./architecture/system-architecture.md)
- **Gaya Arsitektur:** Modular Monorepo berbasis NPM Workspaces dengan strategi *Offline-First Hybrid*.
- **Diagram C4:** Visualisasi konteks sistem (Level 1), kontainer aplikasi (Level 2), dan komponen internal backend/frontend (Level 3).
- **Alur Kerja & State Machine:** Siklus hidup tugas perkuliahan (`todo` $\rightarrow$ `in_progress` $\rightarrow$ `review` $\rightarrow$ `done`), integrasi sesi Pomodoro timer, dan formula perhitungan IPS berbobot.
- **Infrastruktur & Kontainerisasi:** Arsitektur multi-stage Docker dan konfigurasi Nginx reverse proxy.

### 2. [Desain Basis Data & ERD (architecture/database-erd.md)](./architecture/database-erd.md)
- **Diagram ERD Relasional:** Entitas `users`, `courses`, `tasks`, `subtasks`, dan `task_attachments`.
- **Aturan Integritas:** Foreign Key dengan relasi berantai (`ON DELETE CASCADE`), UUID v4, dan validasi *check constraint*.
- **Strategi Indeks B-Tree:** Optimasi indeks untuk pencarian cepat jadwal dan tugas berdasar tenggat waktu (*deadline*).

### 3. [Role Pengguna & Hak Akses RBAC (roles/application-roles.md)](./roles/application-roles.md)
- **Mahasiswa (`mahasiswa`):** Pengguna utama untuk manajemen tugas, jadwal kuliah, timer belajar, dan kalkulator target IPK.
- **Dosen (`dosen`):** Pemantauan jadwal perkuliahan, peninjauan silabus, dan distribusi beban tugas mahasiswa.
- **Admin (`admin`):** Pemeliharaan server (*health check*), verifikasi integritas data master, dan audit akun.
- **Matriks RBAC:** Tabel pemetaan izin CRUD lengkap untuk setiap sumber daya dan modul.

### 4. [Role Tim Rekayasa Monorepo (roles/engineering-roles.md)](./roles/engineering-roles.md)
- Tanggung jawab spesifik, batasan direktori, dan panduan kerja untuk:
  - **Frontend Engineer** (`/frontend`)
  - **Backend Engineer** (`/backend`)
  - **Database Administrator / Data Engineer** (`/database`)
  - **DevOps & Platform Engineer** (`/devops`, `/.github`)
  - **QA & Test Automation Engineer** (`/qa`)

### 5. [Spesifikasi REST API (api/api-specification.md)](./api/api-specification.md)
- Kontrak endpoint REST API v1 untuk modul Auth, Tasks, Courses, Analytics, dan Healthcheck server.
- Format request payload, respons standar (`ApiResponse<T>`), serta kode error HTTP.
