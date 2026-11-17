# Spesifikasi REST API v1 — StudyFlow

Dokumen ini mendokumentasikan spesifikasi teknis antarmuka REST API v1 dari backend StudyFlow, mencakup endpoint, parameter, format payload JSON, serta format respons standar.

---

## 1. Konvensi Dasar

- **Base URL:** `http://localhost:4000/api/v1`
- **Format Data:** `application/json` (UTF-8)
- **Format Respons Seragam:**
```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

---

## 2. Endpoint Health Check

### `GET /health`
Pemeriksaan ketersediaan operasional server backend.
- **Akses:** Publik / Monitoring Tool
- **Contoh Respons (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-11-17T03:00:00.000Z"
}
```

---

## 3. Modul Autentikasi (`/auth`)

### `POST /api/v1/auth/login`
Melakukan verifikasi kredensial pengguna (NIM/NIP dan sandi).
- **Body Request:**
```json
{
  "nim": "220101034",
  "password": "mahasiswa123"
}
```
- **Contoh Respons (200 OK):**
```json
{
  "success": true,
  "message": "Autentikasi berhasil.",
  "data": {
    "user": {
      "id": "user-1",
      "nim": "220101034",
      "name": "Fajar Pratama",
      "role": "mahasiswa",
      "major": "Teknik Informatika",
      "faculty": "Fakultas Ilmu Komputer",
      "semester": 5,
      "university": "Universitas Indonesia",
      "createdAt": "2026-11-17T00:00:00.000Z"
    },
    "token": "demo-bearer-token-user-1-1763348400000"
  }
}
```

---

### `POST /api/v1/auth/register`
Mendaftarkan akun mahasiswa, dosen, atau admin baru.
- **Body Request:**
```json
{
  "nim": "230102045",
  "name": "Sarah Anindya",
  "role": "mahasiswa",
  "major": "Sistem Informasi",
  "faculty": "Fakultas Ilmu Komputer",
  "semester": 3,
  "university": "Universitas Indonesia",
  "password": "passwordAman123"
}
```
- **Contoh Respons (201 Created):**
```json
{
  "success": true,
  "message": "Pendaftaran akun mahasiswa berhasil.",
  "data": {
    "user": {
      "id": "user-1763348450000",
      "nim": "230102045",
      "name": "Sarah Anindya",
      "role": "mahasiswa"
    }
  }
}
```

---

## 4. Modul Tugas Perkuliahan (`/tasks`)

| Metode | URL | Keterangan |
| :--- | :--- | :--- |
| **GET** | `/api/v1/tasks` | Mengambil daftar tugas (Query: `status`, `priority`, `courseId`) |
| **POST** | `/api/v1/tasks` | Membuat tugas baru dengan deadline dan prioritas |
| **PUT** | `/api/v1/tasks/:id` | Memperbarui data tugas atau status pengerjaan |
| **DELETE**| `/api/v1/tasks/:id` | Menghapus tugas |

---

## 5. Modul Jadwal Mata Kuliah (`/courses`)

| Metode | URL | Keterangan |
| :--- | :--- | :--- |
| **GET** | `/api/v1/courses` | Mengambil daftar jadwal mata kuliah semester aktif |
| **POST** | `/api/v1/courses` | Menambahkan mata kuliah baru beserta SKS dan target nilai |
| **PUT** | `/api/v1/courses/:id` | Memperbarui detail mata kuliah |
| **DELETE**| `/api/v1/courses/:id` | Menghapus mata kuliah |

---

## 6. Modul Analitik & Ringkasan (`/analytics`)

### `GET /api/v1/analytics`
Mengambil statistik komputasi beban tugas aktif, penyelesaian, serta proyeksi IPS.
- **Contoh Respons (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalTasks": 8,
    "completedTasks": 3,
    "pendingTasks": 5,
    "totalCourses": 5,
    "totalSks": 15,
    "projectedIps": 3.85
  }
}
```
