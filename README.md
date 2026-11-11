# StudyFlow — Academic Task & Coursework Management System

Sistem manajemen tugas perkuliahan, jadwal mata kuliah mingguan, pelacak beban SKS, dan simulasi indeks prestasi semester (IPS) dengan arsitektur modular monorepo.

---

## Arsitektur Repositori

```
jajal/
├── frontend/               # Aplikasi web React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/                # Kode sumber antarmuka (komponen, hooks, utilitas)
│   ├── public/             # Aset statis peramban
│   └── package.json        # Dependensi dan skrip frontend
├── backend/                # Layanan REST API berbasis Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Handler rute HTTP (auth, tasks, courses, analytics)
│   │   ├── services/       # Logika bisnis dan akses data
│   │   ├── routes/         # Definisi endpoint REST API v1
│   │   ├── middleware/     # Otentikasi, validasi, dan penanganan error
│   │   └── server.ts       # Entrypoint server HTTP
│   └── package.json        # Dependensi dan skrip backend
├── database/               # Skema relasional, migrasi, dan data benih (seed)
│   ├── schema.sql          # DDL PostgreSQL (tabel users, courses, tasks, subtasks)
│   ├── seeds.sql           # Data inisialisasi pengujian
│   └── migrations/         # Berkas migrasi skema terversi
├── qa/                     # Pengujian mutu perangkat lunak otomatis dan manual
│   ├── tests/api/          # Uji integrasi dan smoke testing API
│   ├── postman/            # Koleksi Postman pengujian endpoint REST
│   └── test-plan.md        # Dokumen matriks rencana pengujian formal
├── devops/                 # Konfigurasi containerization dan orkestrasi
│   ├── docker/             # Dockerfile multi-stage untuk frontend dan backend
│   ├── docker-compose.yml  # Orkestrasi lokal (PostgreSQL + API + Web)
│   └── .env.example        # Templat variabel lingkungan
└── .github/workflows/      # Pipeline Continuous Integration (GitHub Actions)
```

---

## Persyaratan Sistem

- Node.js versi 20 LTS atau lebih tinggi
- npm versi 10 atau lebih tinggi
- Docker & Docker Compose (opsional, untuk deployment berbasis container)

---

## Panduan Instalasi dan Menjalankan

### 1. Menjalankan secara Lokal (Development Mode)

Instal dependensi untuk seluruh workspace:
```bash
npm install
```

Jalankan layanan frontend:
```bash
npm run dev:frontend
```
Frontend akan aktif di `http://localhost:5173`.

Jalankan layanan backend API:
```bash
npm run dev:backend
```
Backend API akan aktif di `http://localhost:4000` (Health check: `http://localhost:4000/health`).

### 2. Menjalankan Pengujian Mutu (QA Tests)

Eksekusi suite pengujian otomatis:
```bash
npm test
```

### 3. Kompilasi Produksi (Production Build)

Kompilasi seluruh modul (frontend dan backend):
```bash
npm run build
```

---

## Deployment Menggunakan Docker

Untuk menjalankan seluruh stack sistem (Database PostgreSQL, Backend API, dan Frontend Nginx) dalam container terisolasi:

```bash
docker compose -f devops/docker-compose.yml up --build -d
```

Layanan yang tersedia:
- Web Application: `http://localhost:80`
- REST API: `http://localhost:4000/api/v1`
- PostgreSQL Database: `localhost:5432`

Untuk menghentikan container:
```bash
docker compose -f devops/docker-compose.yml down
```

---

## Spesifikasi Endpoint API (v1)

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/login` | Otentikasi mahasiswa menggunakan NIM dan password |
| POST | `/api/v1/auth/register` | Pendaftaran akun mahasiswa baru |
| GET | `/api/v1/tasks` | Mengambil daftar tugas dengan filter status/prioritas |
| POST | `/api/v1/tasks` | Membuat tugas perkuliahan baru |
| PUT | `/api/v1/tasks/:id` | Memperbarui data tugas atau status penyelesaian |
| DELETE | `/api/v1/tasks/:id` | Menghapus tugas |
| GET | `/api/v1/courses` | Mengambil daftar jadwal mata kuliah semester |
| POST | `/api/v1/courses` | Mendaftarkan mata kuliah baru |
| PUT | `/api/v1/courses/:id` | Memperbarui jadwal atau target nilai mata kuliah |
| DELETE | `/api/v1/courses/:id` | Menghapus mata kuliah |
| GET | `/api/v1/analytics` | Ringkasan statistik tugas dan proyeksi nilai IPS |
| GET | `/health` | Pemeriksaan kesehatan layanan server |
