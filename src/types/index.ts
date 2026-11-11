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
  title: string;
  description?: string;
  courseId: string; // Links to Course.id or 'general' | 'org' | 'skripsi'
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  subtasks: Subtask[];
  attachments: Attachment[];
  createdAt: string;
  completedAt?: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  sks: number;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room: string;
  color: string; // 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'indigo' | 'cyan'
  targetGrade?: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E';
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes (default 25)
  shortBreak: number; // in minutes (default 5)
  longBreak: number; // in minutes (default 15)
  autoStartBreaks: boolean;
}

export interface UserProfile {
  nim: string;
  name: string;
  major: string;
  faculty: string;
  semester: number;
  university: string;
  avatarColor?: string;
}
