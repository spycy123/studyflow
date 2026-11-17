# StudyFlow Academic Task & Coursework Management System

Sistem manajemen tugas perkuliahan, jadwal mata kuliah mingguan, pelacak beban SKS, timer fokus Pomodoro, dan simulasi indeks prestasi semester (IPS) dengan arsitektur **Modular Monorepo** dan konsep **Offline-First Hybrid**.

---

## Dokumentasi Proyek (`docs/`)

Seluruh dokumentasi teknis, cetak biru arsitektur, dan matriks hak akses disimpan terpusat dalam folder **[`docs/`](./docs/README.md)**:

- **[Pusat Dokumentasi (docs/README.md)](./docs/README.md)**: Indeks navigasi lengkap seluruh dokumentasi.
- **[Arsitektur Sistem (docs/architecture/system-architecture.md)](./docs/architecture/system-architecture.md)**: Arsitektur C4, diagram alur sistem, state machine tugas, dan strategi deployment.
- **[Desain Basis Data & ERD (docs/architecture/database-erd.md)](./docs/architecture/database-erd.md)**: Skema PostgreSQL, diagram ERD Mermaid, B-Tree indexes, dan migrasi versi.
- **[Role Pengguna & Matriks Hak Akses (docs/roles/application-roles.md)](./docs/roles/application-roles.md)**: Rincian peran pengguna (**Mahasiswa**, **Dosen**, **Admin**) dan matriks hak akses CRUD (RBAC).
- **[Role Tim Rekayasa Monorepo (docs/roles/engineering-roles.md)](./docs/roles/engineering-roles.md)**: Pembagian tanggung jawab tim rekayasa (Frontend, Backend, DBA, DevOps, QA).
- **[Spesifikasi REST API (docs/api/api-specification.md)](./docs/api/api-specification.md)**: Spesifikasi endpoint REST API v1, format JSON, dan kode status HTTP.
- **[Rencana Pengujian QA (qa/test-plan.md)](./qa/test-plan.md)**: Matriks rencana pengujian fungsional, performa, dan keamanan.

---

## Arsitektur Repositori

```
jajal/
├── docs/                   # Pusat dokumentasi terstruktur sistem StudyFlow
│   ├── README.md           # Indeks navigasi dokumentasi
│   ├── architecture/       # Dokumen arsitektur teknis & skema basis data (ERD)
│   ├── roles/              # Dokumen spesifikasi role pengguna (RBAC) & tim rekayasa
│   └── api/                # Kontrak spesifikasi endpoint REST API v1
├── frontend/               # Aplikasi web React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/                # Kode sumber antarmuka (komponen, hooks, utilitas)
│   ├── public/             # Aset statis peramban
│   └── package.json        # Dependensi dan skrip frontend
├── backend/                # Layanan REST API berbasis Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Handler HTTP (auth, tasks, courses, analytics)
│   │   ├── services/       # Logika bisnis dan akses data (In-memory & PostgreSQL ready)
│   │   ├── routes/         # Definisi endpoint REST API v1
│   │   ├── config/         # Konfigurasi environment & port
│   │   └── server.ts       # Entrypoint server HTTP dengan graceful shutdown
│   └── package.json        # Dependensi dan skrip backend
├── database/               # Skema relasional, migrasi terversi, dan data benih (seed)
│   ├── schema.sql          # DDL PostgreSQL (tabel users, courses, tasks, subtasks, attachments)
│   ├── seeds.sql           # Data inisialisasi pengujian untuk 3 role
│   └── migrations/         # Berkas migrasi skema terversi (001_initial_schema, 002_add_user_roles)
├── qa/                     # Pengujian mutu perangkat lunak otomatis dan manual
│   ├── tests/api/          # Uji smoke test otomatis (node:test native runner)
│   ├── postman/            # Koleksi Postman pengujian endpoint REST
│   └── test-plan.md        # Dokumen matriks rencana pengujian formal
├── devops/                 # Konfigurasi containerization dan orkestrasi
│   ├── docker/             # Dockerfile multi-stage untuk frontend dan backend + nginx.conf
│   ├── docker-compose.yml  # Orkestrasi lokal (PostgreSQL + API + Web)
│   └── .env.example        # Templat variabel lingkungan
├── scripts/                # Skrip otomasi developer (unified dev runner)
│   └── dev.mjs             # Menjalankan Backend + Frontend sekaligus dalam 1 terminal
├── package.json            # Konfigurasi root workspace NPM
└── README.md
```

---

## Akun Demo & Hak Akses Cepat (3 Role)

Aplikasi telah dilengkapi dengan data benih (*seed data*) dan tombol **1-Klik Demo** pada halaman login untuk ketiga role:

| Role | Identitas (NIM/NIP/ID) | Kata Sandi | Nama Pengguna | Karakteristik Akses |
| :--- | :--- | :--- | :--- | :--- |
| **Mahasiswa** | `220101034` | `mahasiswa123` | Fajar Pratama | Kelola tugas Kanban, jadwal kuliah, timer Pomodoro, simulasi nilai & IPS, ekspor JSON lokal. |
| **Dosen** | `198504122010121001` | `dosen123` | Dr. Aris Subagyo, M.Kom | Monitoring jadwal ajar, peninjauan beban penugasan, badge pendidik emerald. |
| **Admin** | `ADMIN001` | `admin123` | Administrator Akademik | Pemantauan kesehatan server (`/health`), verifikasi master data, badge admin violet. |

---

## Panduan Menjalankan Sistem

### Persyaratan Sistem:
- **Node.js**: Versi 20 LTS atau lebih tinggi
- **npm**: Versi 10 atau lebih tinggi
- **Docker & Docker Compose** (opsional, jika ingin menjalankan PostgreSQL berbasis kontainer)

---

### 1. Menjalankan Sekaligus (Cara Paling Cepat & Mudah)

Cukup jalankan satu perintah berikut di direktori root:

```bash
# Jalankan Backend (Port 4000) dan Frontend (Port 5173) secara bersamaan
npm run dev
```

Kedua layanan akan aktif secara otomatis:
- **Frontend Web App:** `http://localhost:5173`
- **Backend REST API:** `http://localhost:4000` (Health Check: `http://localhost:4000/health`)

> *Tekan `Ctrl + C` di terminal kapan saja untuk menghentikan kedua layanan secara bersih (graceful).*

---

### 2. Menjalankan Per Layanan (Opsional)

Jika ingin membuka terminal terpisah:

```bash
# Terminal 1: Backend API
npm run dev:backend

# Terminal 2: Frontend Web
npm run dev:frontend
```

---

### 3. Menjalankan Pengujian Mutu Otomatis (QA Tests)

Eksekusi suite pengujian otomatis (integritas runtime, formula IPS, validasi NIM/NIP, siklus tugas, dan RBAC):

```bash
npm test
```

---

### 4. Kompilasi Produksi (Production Build)

Kompilasi TypeScript dan bundler Vite untuk memastikan tidak ada kesalahan tipe data:

```bash
npm run build
```

---

### 5. Menjalankan Menggunakan Docker (Stack Lengkap)

Untuk menjalankan seluruh stack sistem (Database PostgreSQL, Backend API Node.js, dan Frontend Nginx Web Server):

```bash
# Jalankan kontainer
npm run docker:up

# Atau manual:
docker compose -f devops/docker-compose.yml up --build -d
```

Layanan yang tersedia:
- **Web Application:** `http://localhost:80`
- **REST API:** `http://localhost:4000/api/v1`
- **PostgreSQL Database:** `localhost:5432` (User: `postgres`, Pass: `postgres`, DB: `studyflow`)

Untuk menghentikan kontainer:
```bash
npm run docker:down
```

---

## Spesifikasi Endpoint REST API (v1)

| Metode | Endpoint | Deskripsi | Hak Akses |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | Otentikasi pengguna berdasarkan NIM/NIP dan password | Publik |
| **POST** | `/api/v1/auth/register` | Pendaftaran akun **Mahasiswa**/**Dosen**/**Admin** baru | Publik |
| **GET** | `/api/v1/tasks` | Mengambil daftar tugas (filter status, priority, courseId) | Terotentikasi |
| **POST** | `/api/v1/tasks` | Membuat tugas perkuliahan baru | **Mahasiswa** / **Admin** |
| **PUT** | `/api/v1/tasks/:id` | Memperbarui data tugas atau status (`todo`, `in_progress`, `review`, `done`) | **Mahasiswa** / **Admin** |
| **DELETE**| `/api/v1/tasks/:id` | Menghapus tugas | **Mahasiswa** / **Admin** |
| **GET** | `/api/v1/courses` | Mengambil daftar jadwal mata kuliah semester | Terotentikasi |
| **POST** | `/api/v1/courses` | Mendaftarkan mata kuliah baru | **Mahasiswa** / **Admin** |
| **PUT** | `/api/v1/courses/:id` | Memperbarui jadwal atau target nilai mata kuliah | **Mahasiswa** / **Admin** |
| **DELETE**| `/api/v1/courses/:id` | Menghapus mata kuliah | **Mahasiswa** / **Admin** |
| **GET** | `/api/v1/analytics` | Ringkasan statistik tugas dan proyeksi nilai IPS | Terotentikasi |
| **GET** | `/health` | Pemeriksaan kesehatan layanan server | Publik / Monitoring |
