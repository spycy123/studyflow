# Rencana Pengujian QA (Quality Assurance Test Plan)

## 1. Lingkup Pengujian
Dokumen ini menetapkan strategi pengujian untuk sistem StudyFlow, mencakup antarmuka pengguna (Frontend), antarmuka pemrograman aplikasi (Backend REST API), integritas basis data, serta kesiapan deployment.

## 2. Matriks Pengujian Fungsional

| ID Kasus | Modul | Deskripsi Pengujian | Kriteria Keberhasilan |
| :--- | :--- | :--- | :--- |
| TC-AUTH-01 | Auth | Registrasi mahasiswa baru dengan NIM unik | Response HTTP 201, akun tersimpan |
| TC-AUTH-02 | Auth | Registrasi dengan NIM yang sudah ada | Response HTTP 409 Conflict |
| TC-AUTH-03 | Auth | Login dengan kredensial valid | Response HTTP 200, return token sesi |
| TC-AUTH-04 | Auth | Login dengan password salah | Response HTTP 401 Unauthorized |
| TC-TASK-01 | Tasks | Buat tugas baru dengan kategori dan deadline | Response HTTP 201, data terindeks |
| TC-TASK-02 | Tasks | Pembaruan status tugas dari 'todo' ke 'done' | Response HTTP 200, completedAt terisi |
| TC-TASK-03 | Tasks | Hapus tugas berdasarkan ID | Response HTTP 200, record terhapus |
| TC-CRS-01  | Course | Tambah mata kuliah dan hitung beban SKS | Data tampil pada timetable mingguan |
| TC-GPA-01  | Grade | Kalkulasi simulasi IPS berdasarkan target SKS | Output IPS sesuai rumus mutu 4.00 |

## 3. Pengujian Keamanan & Validasi Input
- Validasi format NIM numerik.
- Sanitasi input teks bebas untuk mencegah XSS pada catatan tugas.
- Pengujian pembatasan rute API tanpa otentikasi.

## 4. Pengujian Regresi & Performa
- Pemeriksaan beban query saat memuat > 500 tugas aktif.
- Uji responsivitas antarmuka pada resolusi Mobile (375px), Tablet (768px), dan Desktop (1440px).
