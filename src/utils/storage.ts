import type { Task, Course, UserProfile } from '../types';

const STORAGE_KEY_TASKS_PREFIX = 'studyflow_tasks_user_';
const STORAGE_KEY_COURSES_PREFIX = 'studyflow_courses_user_';
const STORAGE_KEY_DARKMODE = 'studyflow_theme_dark';
const STORAGE_KEY_CURRENT_USER = 'studyflow_current_user_v1';
const STORAGE_KEY_USERS_DB = 'studyflow_users_db_v1';

// Legacy keys for fallback / migration
const LEGACY_STORAGE_KEY_TASKS = 'studyflow_tasks_v1';
const LEGACY_STORAGE_KEY_COURSES = 'studyflow_courses_v1';

// Helper to format date offset from today
const getRelativeDateStr = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'IF2102',
    name: 'Pemrograman Web Modern',
    lecturer: 'Dr. Aris Subagyo, M.Kom',
    sks: 3,
    day: 'Senin',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Labkom Web (R.302)',
    color: 'blue',
    targetGrade: 'A',
  },
  {
    id: 'course-2',
    code: 'IF2104',
    name: 'Basis Data & SQL Terdistribusi',
    lecturer: 'Prof. Maya Indriati, Ph.D',
    sks: 3,
    day: 'Selasa',
    startTime: '10:00',
    endTime: '12:30',
    room: 'R. Teater Sains A',
    color: 'emerald',
    targetGrade: 'A',
  },
  {
    id: 'course-3',
    code: 'IF2107',
    name: 'Algoritma & Struktur Data',
    lecturer: 'Ir. Hendra Gunawan, M.T.',
    sks: 4,
    day: 'Rabu',
    startTime: '13:00',
    endTime: '16:30',
    room: 'Labkom Algoritma 2',
    color: 'violet',
    targetGrade: 'A',
  },
  {
    id: 'course-4',
    code: 'KU2011',
    name: 'Etika Profesi & Kepemimpinan',
    lecturer: 'Dra. Lestari Utami, M.Si',
    sks: 2,
    day: 'Kamis',
    startTime: '09:00',
    endTime: '10:40',
    room: 'Gedung Kuliah Bersama 405',
    color: 'amber',
    targetGrade: 'AB',
  },
  {
    id: 'course-5',
    code: 'IF2109',
    name: 'Jaringan Komputer',
    lecturer: 'Bayu Prasetyo, S.Kom., M.Eng.',
    sks: 3,
    day: 'Jumat',
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab Jaringan CISCO',
    color: 'rose',
    targetGrade: 'A',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Laporan Praktikum Query Optimization & Indexing',
    description: 'Bandingkan waktu eksekusi query dengan dan tanpa B-Tree index pada dataset 100.000 row.',
    courseId: 'course-2',
    category: 'laporan',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: getRelativeDateStr(1),
    dueTime: '23:59',
    subtasks: [
      { id: 'sub-1', title: 'Export benchmark query EXPLAIN ANALYZE', completed: true },
      { id: 'sub-2', title: 'Buat grafik komparasi performa', completed: true },
      { id: 'sub-3', title: 'Tulis kesimpulan & rekomendasi index', completed: false },
      { id: 'sub-4', title: 'Upload PDF ke portal e-learning kampus', completed: false },
    ],
    attachments: [
      { title: 'Drive Praktikum', url: 'https://drive.google.com' },
      { title: 'Portal Kuliah LMS', url: 'https://elearning.kampus.ac.id' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Proyek Akhir Web: Desain Frontend UI & Auth System',
    description: 'Implementasi komponen antarmuka pengguna berbasis React + Tailwind dan integrasi JWT login token.',
    courseId: 'course-1',
    category: 'proyek',
    priority: 'high',
    status: 'in_progress',
    dueDate: getRelativeDateStr(3),
    dueTime: '17:00',
    subtasks: [
      { id: 'sub-21', title: 'Setup state management autentikasi', completed: true },
      { id: 'sub-22', title: 'Integrasi endpoint register & login API', completed: false },
      { id: 'sub-23', title: 'Uji coba responsive mobile view', completed: false },
    ],
    attachments: [
      { title: 'Figma Design', url: 'https://figma.com' },
      { title: 'Repository GitHub', url: 'https://github.com' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Latihan Kuis: Dynamic Programming & Binary Search Tree',
    description: 'Pelajari studi kasus Knapsack Problem, Longest Common Subsequence, dan BST balancing.',
    courseId: 'course-3',
    category: 'kuis',
    priority: 'high',
    status: 'todo',
    dueDate: getRelativeDateStr(2),
    dueTime: '13:00',
    subtasks: [
      { id: 'sub-31', title: 'Review slide kuliah pertemuan 7 & 8', completed: false },
      { id: 'sub-32', title: 'Kerjakan 3 latihan soal LeetCode', completed: false },
    ],
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Draft Makalah Dampak AI terhadap Etika Profesi IT',
    description: 'Minimal 6 halaman, format IEEE, mencakup studi kasus plagiarism kode dan bias algoritma.',
    courseId: 'course-4',
    category: 'tugas',
    priority: 'medium',
    status: 'todo',
    dueDate: getRelativeDateStr(5),
    dueTime: '23:59',
    subtasks: [
      { id: 'sub-41', title: 'Cari 4 referensi jurnal terakreditasi', completed: false },
      { id: 'sub-42', title: 'Tulis Bab 1 Pendahuluan & Bab 2 Tinjauan Pustaka', completed: false },
    ],
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Simulasi Topologi Jaringan Kampus via Cisco Packet Tracer',
    description: 'Konfigurasi VLAN 10, 20, 30 beserta Inter-VLAN Routing pada switch multilayer 3560.',
    courseId: 'course-5',
    category: 'laporan',
    priority: 'medium',
    status: 'todo',
    dueDate: getRelativeDateStr(6),
    dueTime: '12:00',
    subtasks: [
      { id: 'sub-51', title: 'Buat skema IP addressing VLSM', completed: false },
      { id: 'sub-52', title: 'Export file .pkt dan screenshot ping test', completed: false },
    ],
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Rapat Pleno Divisi Acara: Persiapan Workshop Nasional',
    description: 'Finalisasi rundown pembicara, pengisi ice breaking, dan koordinasi dengan divisi humas.',
    courseId: 'org',
    category: 'organisasi',
    priority: 'medium',
    status: 'todo',
    dueDate: getRelativeDateStr(0),
    dueTime: '19:30',
    subtasks: [],
    attachments: [
      { title: 'Google Docs Rundown', url: 'https://docs.google.com' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: 'Bayar Tagihan UKT & Validasi KRS Semester Ini',
    description: 'Cetak bukti transfer virtual account bank dan simpan di Google Drive perkuliahan.',
    courseId: 'general',
    category: 'lainnya',
    priority: 'urgent',
    status: 'done',
    dueDate: getRelativeDateStr(-2),
    dueTime: '15:00',
    subtasks: [
      { id: 'sub-71', title: 'Generate kode billing di SIAKAD', completed: true },
      { id: 'sub-72', title: 'Transfer via m-banking', completed: true },
      { id: 'sub-73', title: 'Screenshot tanda terima', completed: true },
    ],
    attachments: [],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: 'Cari 5 Paper Literatur Review untuk Proposal Skripsi',
    description: 'Fokus topik: Sistem Rekomendasi Matakuliah menggunakan Graph Neural Network.',
    courseId: 'skripsi',
    category: 'skripsi',
    priority: 'low',
    status: 'in_progress',
    dueDate: getRelativeDateStr(8),
    dueTime: '23:59',
    subtasks: [
      { id: 'sub-81', title: 'Download paper dari IEEE Xplore & ACM', completed: true },
      { id: 'sub-82', title: 'Rangkum state-of-the-art method', completed: false },
    ],
    attachments: [],
    createdAt: new Date().toISOString(),
  },
];

// Default Demo Student Profile
export const DEFAULT_DEMO_USER: UserProfile = {
  nim: '220101034',
  name: 'Fajar Pratama',
  major: 'Teknik Informatika',
  faculty: 'Fakultas Ilmu Komputer',
  semester: 5,
  university: 'Universitas Indonesia',
  avatarColor: 'blue',
};

export const DEFAULT_DEMO_PASSWORD = 'mahasiswa123';

// User Database Helpers
export const getUsersDB = (): Record<string, { profile: UserProfile; passwordHash: string }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (!raw) {
      const initialDB: Record<string, { profile: UserProfile; passwordHash: string }> = {
        [DEFAULT_DEMO_USER.nim]: {
          profile: DEFAULT_DEMO_USER,
          passwordHash: DEFAULT_DEMO_PASSWORD,
        },
      };
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(initialDB));
      return initialDB;
    }
    return JSON.parse(raw);
  } catch {
    return {
      [DEFAULT_DEMO_USER.nim]: {
        profile: DEFAULT_DEMO_USER,
        passwordHash: DEFAULT_DEMO_PASSWORD,
      },
    };
  }
};

export const registerUser = (
  profile: UserProfile,
  password: string
): { success: boolean; message: string } => {
  try {
    const db = getUsersDB();
    const cleanNim = profile.nim.trim();
    if (!cleanNim) return { success: false, message: 'NIM wajib diisi.' };
    if (!password || password.length < 4) {
      return { success: false, message: 'Password minimal 4 karakter.' };
    }
    if (db[cleanNim]) {
      return { success: false, message: 'NIM sudah terdaftar. Silakan login.' };
    }

    db[cleanNim] = {
      profile: {
        ...profile,
        nim: cleanNim,
      },
      passwordHash: password,
    };
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));

    // Seed default sample courses and tasks for new user
    saveTasksForUser(cleanNim, INITIAL_TASKS);
    saveCoursesForUser(cleanNim, INITIAL_COURSES);

    return { success: true, message: 'Registrasi berhasil!' };
  } catch {
    return { success: false, message: 'Terjadi kesalahan sistem.' };
  }
};

export const loginUser = (
  nim: string,
  password: string
): { success: boolean; user?: UserProfile; message: string } => {
  try {
    const db = getUsersDB();
    const cleanNim = nim.trim();
    const userRecord = db[cleanNim];

    if (!userRecord) {
      return { success: false, message: 'NIM tidak ditemukan. Silakan daftar terlebih dahulu.' };
    }

    if (userRecord.passwordHash !== password) {
      return { success: false, message: 'Password salah. Coba lagi.' };
    }

    // Save active session
    saveCurrentUser(userRecord.profile);
    return { success: true, user: userRecord.profile, message: 'Login berhasil!' };
  } catch {
    return { success: false, message: 'Gagal memproses login.' };
  }
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user: UserProfile | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  } catch {
    // Ignore
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
};

// User-scoped Tasks Storage
export const loadTasksForUser = (nim: string): Task[] => {
  try {
    const key = STORAGE_KEY_TASKS_PREFIX + nim;
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Check legacy storage first for smooth migration
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_TASKS);
      if (legacyRaw) {
        localStorage.setItem(key, legacyRaw);
        return JSON.parse(legacyRaw);
      }
      localStorage.setItem(key, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
};

export const saveTasksForUser = (nim: string, tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS_PREFIX + nim, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};

// User-scoped Courses Storage
export const loadCoursesForUser = (nim: string): Course[] => {
  try {
    const key = STORAGE_KEY_COURSES_PREFIX + nim;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY_COURSES);
      if (legacyRaw) {
        localStorage.setItem(key, legacyRaw);
        return JSON.parse(legacyRaw);
      }
      localStorage.setItem(key, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COURSES;
  }
};

export const saveCoursesForUser = (nim: string, courses: Course[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_COURSES_PREFIX + nim, JSON.stringify(courses));
  } catch (e) {
    console.error('Failed to save courses', e);
  }
};

export const loadDarkModeFromStorage = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DARKMODE);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const saveDarkModeToStorage = (isDark: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY_DARKMODE, JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // Ignore
  }
};

export const resetUserToDefault = (nim: string): { tasks: Task[]; courses: Course[] } => {
  saveTasksForUser(nim, INITIAL_TASKS);
  saveCoursesForUser(nim, INITIAL_COURSES);
  return { tasks: INITIAL_TASKS, courses: INITIAL_COURSES };
};
