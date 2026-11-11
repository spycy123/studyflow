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

export const getCategoryBadge = (category: TaskCategory) => {
  switch (category) {
    case 'tugas':
      return {
        label: 'Tugas Kuliah',
        bg: 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40',
        dot: 'bg-blue-500',
      };
    case 'kuis':
      return {
        label: 'Kuis & Responsi',
        bg: 'bg-violet-50 text-violet-700 border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/40',
        dot: 'bg-violet-500',
      };
    case 'uts_uas':
      return {
        label: 'UTS / UAS',
        bg: 'bg-amber-50 text-amber-800 border-amber-200/70 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40',
        dot: 'bg-amber-500',
      };
    case 'laporan':
      return {
        label: 'Laporan Praktikum',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40',
        dot: 'bg-emerald-500',
      };
    case 'proyek':
      return {
        label: 'Proyek / Tubes',
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/70 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/40',
        dot: 'bg-cyan-500',
      };
    case 'organisasi':
      return {
        label: 'Organisasi & BEM',
        bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/70 dark:bg-fuchsia-950/50 dark:text-fuchsia-300 dark:border-fuchsia-800/40',
        dot: 'bg-fuchsia-500',
      };
    case 'skripsi':
      return {
        label: 'Skripsi / Riset',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/40',
        dot: 'bg-indigo-500',
      };
    case 'lainnya':
      return {
        label: 'Umum / Pribadi',
        bg: 'bg-slate-100 text-slate-700 border-slate-200/70 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/50',
        dot: 'bg-slate-400',
      };
  }
};

export const getPriorityBadge = (priority: Priority) => {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Mendesak',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
        dot: 'bg-rose-500',
        glow: 'ring-rose-500/20',
      };
    case 'high':
      return {
        label: 'Tinggi',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
        dot: 'bg-amber-500',
        glow: 'ring-amber-500/20',
      };
    case 'medium':
      return {
        label: 'Sedang',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
        dot: 'bg-blue-500',
        glow: 'ring-blue-500/20',
      };
    case 'low':
      return {
        label: 'Rendah',
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        dot: 'bg-slate-400',
        glow: 'ring-slate-500/20',
      };
  }
};

export const getCourseColorClasses = (color: string) => {
  const map: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      badge: string;
      borderAccent: string;
      gradient: string;
      indicator: string;
    }
  > = {
    blue: {
      bg: 'bg-blue-50/70 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200/80 dark:border-blue-800/40',
      badge: 'bg-blue-100/80 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40',
      borderAccent: 'border-l-blue-500 dark:border-l-blue-400',
      gradient: 'from-blue-500/10 to-transparent',
      indicator: 'bg-blue-500',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-800/40',
      badge: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40',
      borderAccent: 'border-l-emerald-500 dark:border-l-emerald-400',
      gradient: 'from-emerald-500/10 to-transparent',
      indicator: 'bg-emerald-500',
    },
    violet: {
      bg: 'bg-purple-50/70 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200/80 dark:border-purple-800/40',
      badge: 'bg-purple-100/80 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/40',
      borderAccent: 'border-l-purple-500 dark:border-l-purple-400',
      gradient: 'from-purple-500/10 to-transparent',
      indicator: 'bg-purple-500',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/30',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200/80 dark:border-amber-800/40',
      badge: 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40',
      borderAccent: 'border-l-amber-500 dark:border-l-amber-400',
      gradient: 'from-amber-500/10 to-transparent',
      indicator: 'bg-amber-500',
    },
    rose: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200/80 dark:border-rose-800/40',
      badge: 'bg-rose-100/80 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40',
      borderAccent: 'border-l-rose-500 dark:border-l-rose-400',
      gradient: 'from-rose-500/10 to-transparent',
      indicator: 'bg-rose-500',
    },
    cyan: {
      bg: 'bg-cyan-50/70 dark:bg-cyan-950/30',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200/80 dark:border-cyan-800/40',
      badge: 'bg-cyan-100/80 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200/60 dark:border-cyan-800/40',
      borderAccent: 'border-l-cyan-500 dark:border-l-cyan-400',
      gradient: 'from-cyan-500/10 to-transparent',
      indicator: 'bg-cyan-500',
    },
  };
  return map[color] || map.blue;
};

// Formats relative deadline string with urgency indication
export const formatDeadlineText = (
  dueDateStr: string,
  dueTime?: string
): { text: string; isOverdue: boolean; isToday: boolean; isSoon: boolean } => {
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
