import type { User, Task, Course } from '../types/index.js';

class InMemoryDatabase {
  public users: Map<string, User> = new Map();
  public tasks: Map<string, Task> = new Map();
  public courses: Map<string, Course> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const demoUser: User = {
      id: 'user-1',
      nim: '220101034',
      name: 'Fajar Pratama',
      major: 'Teknik Informatika',
      faculty: 'Fakultas Ilmu Komputer',
      semester: 5,
      university: 'Universitas Indonesia',
      passwordHash: 'mahasiswa123',
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    const defaultCourses: Course[] = [
      {
        id: 'course-1',
        userId: 'user-1',
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
        userId: 'user-1',
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
        userId: 'user-1',
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
        userId: 'user-1',
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
    ];

    defaultCourses.forEach((c) => this.courses.set(c.id, c));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultTasks: Task[] = [
      {
        id: 'task-1',
        userId: 'user-1',
        title: 'Laporan Praktikum Query Optimization & Indexing',
        description: 'Bandingkan waktu eksekusi query dengan dan tanpa B-Tree index pada dataset 100.000 row.',
        courseId: 'course-2',
        category: 'laporan',
        priority: 'urgent',
        status: 'in_progress',
        dueDate: tomorrow.toISOString().split('T')[0],
        dueTime: '23:59',
        subtasks: [
          { id: 'sub-1', title: 'Export benchmark query EXPLAIN ANALYZE', completed: true },
          { id: 'sub-2', title: 'Buat grafik komparasi performa', completed: false },
        ],
        attachments: [{ title: 'Portal Kuliah LMS', url: 'https://elearning.kampus.ac.id' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task-2',
        userId: 'user-1',
        title: 'Proyek Akhir Web: Implementasi Autentikasi dan API Restful',
        description: 'Implementasi antarmuka React dan integrasi endpoint JWT.',
        courseId: 'course-1',
        category: 'proyek',
        priority: 'high',
        status: 'todo',
        dueDate: tomorrow.toISOString().split('T')[0],
        dueTime: '17:00',
        subtasks: [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    defaultTasks.forEach((t) => this.tasks.set(t.id, t));
  }
}

export const db = new InMemoryDatabase();
