import type { Priority, TaskCategory } from '../types';

export const getCategoryLabel = (category: TaskCategory): string => {
  switch (category) {
    case 'tugas':
      return 'Tugas Kuliah';
    case 'kuis':
      return 'Kuis / Ujian Kecil';
    case 'uts_uas':
      return 'UTS / UAS';
    case 'laporan':
      return 'Laporan / Praktikum';
    case 'proyek':
      return 'Proyek / Tugas Besar';
    case 'organisasi':
      return 'Organisasi / UKM';
    case 'skripsi':
      return 'Tugas Akhir / Skripsi';
    case 'lainnya':
      return 'Pribadi / Umum';
  }
};

export const getPriorityBadge = (priority: Priority) => {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Mendesak',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50',
        dot: 'bg-rose-500',
      };
    case 'high':
      return {
        label: 'Tinggi',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
        dot: 'bg-amber-500',
      };
    case 'medium':
      return {
        label: 'Sedang',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
        dot: 'bg-blue-500',
      };
    case 'low':
      return {
        label: 'Rendah',
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        dot: 'bg-slate-400',
      };
  }
};

export const getCourseColorClasses = (color: string) => {
  const map: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800/40',
      badge: 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      badge: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
    violet: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800/40',
      badge: 'bg-purple-100/70 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/40',
      badge: 'bg-amber-100/70 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/40',
      badge: 'bg-rose-100/70 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      text: 'text-cyan-700 dark:text-cyan-400',
      border: 'border-cyan-200 dark:border-cyan-800/40',
      badge: 'bg-cyan-100/70 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    },
  };
  return map[color] || map.blue;
};

// Formats relative deadline string with urgency indication
export const formatDeadlineText = (dueDateStr: string, dueTime?: string): { text: string; isOverdue: boolean; isToday: boolean; isSoon: boolean } => {
  if (!dueDateStr) return { text: '-', isOverdue: false, isToday: false, isSoon: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const timeSuffix = dueTime ? ` pukul ${dueTime}` : '';

  if (diffDays < 0) {
    return {
      text: `Terlewat ${Math.abs(diffDays)} hari lalu`,
      isOverdue: true,
      isToday: false,
      isSoon: false,
    };
  } else if (diffDays === 0) {
    return {
      text: `Hari ini${timeSuffix}`,
      isOverdue: false,
      isToday: true,
      isSoon: true,
    };
  } else if (diffDays === 1) {
    return {
      text: `Besok${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isSoon: true,
    };
  } else if (diffDays === 2) {
    return {
      text: `2 hari lagi${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isSoon: true,
    };
  } else if (diffDays < 7) {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return {
      text: `${dayNames[new Date(dueDateStr).getDay()]}${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isSoon: false,
    };
  } else {
    // Format DD MMM YYYY
    const d = new Date(dueDateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return {
      text: `${d.getDate()} ${months[d.getMonth()]}${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isSoon: false,
    };
  }
};
