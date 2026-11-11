export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskCategory =
  | 'tugas'
  | 'kuis'
  | 'uts_uas'
  | 'laporan'
  | 'proyek'
  | 'organisasi'
  | 'skripsi'
  | 'lainnya';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  title: string;
  url: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  courseId: string;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  dueTime?: string;
  subtasks: Subtask[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Course {
  id: string;
  userId: string;
  code: string;
  name: string;
  lecturer: string;
  sks: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  targetGrade?: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E';
}

export interface User {
  id: string;
  nim: string;
  name: string;
  major: string;
  faculty: string;
  semester: number;
  university: string;
  passwordHash: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
