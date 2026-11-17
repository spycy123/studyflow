# Arsitektur Sistem — StudyFlow

Dokumen ini menjelaskan arsitektur teknis menyeluruh dari sistem **StudyFlow**, mencakup prinsip desain, diagram C4 (Context, Container, Component), diagram alur kerja, siklus hidup tugas, serta infrastruktur *deployment*.

---

## 1. Ikhtisar & Gaya Arsitektur

StudyFlow dirancang menggunakan pendekatan **Modular Monorepo** dan arsitektur **Offline-First Hybrid Client-Server**:

```mermaid
flowchart TD
    Client["Client Devices\n(Peramban Web / Mobile Browser)"]
    
    subgraph EdgeLayer["Edge & Ingress Layer"]
        Nginx["Nginx Reverse Proxy & Static Host\n(Port 80)"]
    end
    
    subgraph ApplicationLayer["Application Layer"]
        Frontend["Frontend SPA\nReact 19 + Vite + Tailwind CSS\n(Port 5173 / Static Nginx)"]
        Backend["Backend REST API Service\nNode.js + Express + TypeScript\n(Port 4000)"]
    end
    
    subgraph DataPersistenceLayer["Data Persistence Layer"]
        LocalStorage[("Browser LocalStorage\nOffline-First Storage")]
        InMemoryDB[("In-Memory DB Engine\n(Dev & Fallback Cache)")]
        Postgres[("PostgreSQL 15+ Relational DB\n(Port 5432)")]
    end

    Client --> Nginx
    Nginx -->|Route /| Frontend
    Nginx -->|Proxy /api/| Backend
    Frontend <-->|Direct Local Storage Cache| LocalStorage
    Frontend <-->|REST API v1 HTTP/JSON| Backend
    Backend <-->|Dev / Fallback| InMemoryDB
    Backend <-->|Production Persistence| Postgres
```

### Karakteristik Desain:
1. **Modular Monorepo:** Dikelola menggunakan NPM Workspaces (`frontend`, `backend`, `qa`) yang memungkinkan manajemen dependensi terpadu serta kompilasi independen.
2. **Offline-First Resilience:** Pengguna tetap dapat mengelola tugas, jadwal kuliah, dan timer belajar secara instan tanpa latensi jaringan memanfaatkan layer penyimpanan lokal peramban (`localStorage`). Data dapat disinkronkan ke backend REST API.
3. **Harmonisasi Desain & Palet Warna:**
   - **Plum / Royal Purple (`#5C3F6F`):** Warna primer (*brand primary*), header, tombol aksi utama, dan kartu dominan.
   - **Golden Yellow (`#F9D13C`):** Warna sekunder (*vibrant highlight*), badge urgensi, bintang prestasi, indikator aktif, dan aksen tombol.
   - **Warm White / Cream (`#FDF6EE`):** Warna aksen khusus (*accent color*), badge pill kontras, border lembut, teks kontras pada tombol gelap, serta efek cahaya latar.
4. **Layered Architecture:** Backend menerapkan pemisahan tanggung jawab yang ketat:
   - *Routes Layer:* Routing URL dan mapping HTTP method.
   - *Controllers Layer:* Validasi payload masukan dan serialisasi respons HTTP JSON.
   - *Services Layer:* Logika komputasi SKS, IPS, serta akses data.
5. **Containerized Multi-Stage:** Konfigurasi Docker multi-stage memastikan ukuran image produksi tetap ramping dan aman.

---

## 2. Model C4 — Visualisasi Sistem

### C4 Level 1: System Context Diagram

```mermaid
flowchart TB
    Mahasiswa["Mahasiswa\n(Primary User)"]
    Dosen["Dosen / Pengajar\n(Academic Instructor)"]
    Admin["Admin Akademik\n(System Administrator)"]

    StudyFlow["StudyFlow System\n(Academic & Productivity Platform)"]
    
    LMS["Sistem LMS Kampus\n(Moodle / Google Classroom)"]
    Storage["Cloud Storage\n(Google Drive / OneDrive)"]

    Mahasiswa -->|"Kelola tugas, jadwal kuliah,\nPomodoro timer, simulasi IPK"| StudyFlow
    Dosen -->|"Monitoring beban penugasan,\nsilabus mata kuliah"| StudyFlow
    Admin -->|"Manajemen data master,\naudit sistem, pemantauan server"| StudyFlow

    StudyFlow -.->|"Tautan referensi tugas & materi"| LMS
    StudyFlow -.->|"Tautan berkas lampiran"| Storage
```

---

### C4 Level 2: Container Diagram

```mermaid
flowchart LR
    subgraph Browser["Peramban Klien"]
        UI["React 19 SPA Container\n- State: UserProfile, Tasks, Courses\n- Offline Storage Manager\n- Dark / Light Theme"]
    end

    subgraph ServerInfra["Server Infrastructure"]
        Proxy["Nginx Ingress / Web Server\n- Port 80\n- Gzip & Caching\n- Reverse Proxy"]
        API["Node.js Express REST API\n- Port 4000\n- Controllers: Auth, Tasks, Courses, Analytics\n- Middleware: CORS, Validation, Error Handler"]
        DB[("PostgreSQL 15 Container\n- Port 5432\n- Relational tables\n- Indexes & FK constraints")]
    end

    UI -->|"HTTP Request / Static Assets"| Proxy
    Proxy -->|"Forward /api/*"| API
    API -->|"SQL Queries (pg)"| DB
```

---

### C4 Level 3: Component Diagram (Backend API)

```mermaid
flowchart TD
    subgraph BackendComponents["Backend API (src/)"]
        Server["server.ts\n(HTTP Lifecycle & Graceful Shutdown)"]
        App["app.ts\n(Express App, CORS, Error Handler, Healthcheck)"]
        
        Router["routes/index.ts\n(/api/v1)"]
        
        AuthR["routes/auth.routes.ts"]
        TaskR["routes/task.routes.ts"]
        CourseR["routes/course.routes.ts"]
        AnalyticsR["routes/analytics.routes.ts"]
        
        AuthC["controllers/auth.controller.ts\n(login, register)"]
        TaskC["controllers/task.controller.ts\n(CRUD, filter, status)"]
        CourseC["controllers/course.controller.ts\n(CRUD, timetable)"]
        AnalyticsC["controllers/analytics.controller.ts\n(IPS & Workload)"]
        
        DBSvc["services/db.service.ts\n(Data Access Layer & Seed Engine)"]
    end

    Server --> App
    App --> Router
    Router --> AuthR & TaskR & CourseR & AnalyticsR
    AuthR --> AuthC
    TaskR --> TaskC
    CourseR --> CourseC
    AnalyticsR --> AnalyticsC
    AuthC & TaskC & CourseC & AnalyticsC --> DBSvc
```

---

## 3. Alur Kerja Kunci Sistem (System Workflows)

### A. Alur Otentikasi & Otorisasi Pengguna

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna (Mahasiswa/Dosen/Admin)
    participant UI as Frontend React
    participant API as Backend Auth API
    participant Store as LocalStorage / Database

    User->>UI: Input Identitas (NIM/NIP) & Password
    UI->>API: POST /api/v1/auth/login { nim, password }
    API->>Store: Cari user berdasarkan NIM & verifikasi hash
    alt Kredensial Valid
        Store-->>API: Data User (Termasuk Role: mahasiswa/dosen/admin)
        API-->>UI: 200 OK + JWT Token + UserProfile (dengan Role)
        UI->>Store: Simpan sesi aktif & perbarui state UI sesuai Role
        UI-->>User: Tampilkan Dashboard yang dipersonalisasi
    else Kredensial Salah
        API-->>UI: 401 Unauthorized { success: false, error: '...' }
        UI-->>User: Tampilkan pesan error pada form
    end
```

---

### B. Siklus Hidup Tugas (Task State Machine)

```mermaid
stateDiagram-v2
    [*] --> todo: Tugas Dibuat (Baru)
    todo --> in_progress: Mulai Dikerjakan / Fokus Pomodoro
    in_progress --> review: Selesai Draft / Siap Diperiksa
    review --> done: Dikumpulkan ke Dosen / LMS
    done --> todo: Re-open / Revisi Tugas
    in_progress --> done: Selesai Langsung
    done --> [*]
```

---

### C. Alur Sesi Pomodoro Terintegrasi Tugas

```mermaid
sequenceDiagram
    autonumber
    actor Mhs as Mahasiswa
    participant UI as Pomodoro Component
    participant TaskState as Task State Manager
    participant Audio as Web Audio Synthesizer

    Mhs->>UI: Pilih Tugas untuk Sesi Fokus ("Fokuskan")
    UI->>TaskState: Set activeFocusTask
    Mhs->>UI: Klik Mulai Timer (25 Menit)
    loop Setiap Detik
        UI->>UI: Hitung mundur sisa detik
    end
    UI->>Audio: Putar nada bel sesi berakhir (Oscillator Sine 880Hz)
    UI->>TaskState: Catat progres / centang sub-tugas yang diselesaikan
    UI-->>Mhs: Notifikasi: "Sesi Fokus Selesai! Saatnya Istirahat 5 Menit"
```

---

### D. Formula Kalkulasi Proyeksi IPS (Indeks Prestasi Semester)

Formula matematis penentuan nilai indeks prestasi semester berbobot SKS:

$$\text{IPS} = \frac{\sum_{i=1}^{n} (\text{SKS}_i \times \text{Bobot Nilai}_i)}{\sum_{i=1}^{n} \text{SKS}_i}$$

Tabel konversi standar nilai huruf ke angka bobot mutu:
| Nilai Huruf | Bobot Angka | Keterangan Mutu |
| :---: | :---: | :--- |
| **A** | 4.00 | Sangat Istimewa |
| **AB** | 3.50 | Istimewa |
| **B** | 3.00 | Sangat Baik |
| **BC** | 2.50 | Baik |
| **C** | 2.00 | Cukup |
| **D** | 1.00 | Kurang |
| **E** | 0.00 | Gagal |

---

## 4. Arsitektur Deployment & Kontainerisasi

```
                    ┌────────────────────────┐
                    │      Host Client       │
                    └───────────┬────────────┘
                                │ Port 80
                                ▼
         ┌───────────────────────────────────────────────┐
         │             Container: Frontend               │
         │   Nginx Alpine (Reverse Proxy & Static SPA)   │
         └───────┬───────────────────────────────┬───────┘
                 │ Proxy /api/*                  │ Serve /
                 │ Port 4000                     │ Static files
                 ▼                               ▼
    ┌─────────────────────────┐      ┌─────────────────────────┐
    │   Container: Backend    │      │    Assets (HTML/JS/CSS) │
    │ Node 22 Alpine Express  │      └─────────────────────────┘
    └────────────┬────────────┘
                 │ TCP 5432
                 ▼
    ┌─────────────────────────┐
    │   Container: Database   │
    │   PostgreSQL 15 Alpine  │
    └─────────────────────────┘
```
