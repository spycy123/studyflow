import React from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Search,
  LayoutList,
  Kanban,
} from 'lucide-react';
import type { Task, Course, UserProfile } from '../types';

interface StatsOverviewProps {
  tasks: Task[];
  courses: Course[];
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'today' | 'urgent' | 'done';
  setFilterStatus: (status: 'all' | 'today' | 'urgent' | 'done') => void;
  selectedCourseFilter: string;
  setSelectedCourseFilter: (id: string) => void;
  currentUser?: UserProfile;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  tasks,
  courses,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  selectedCourseFilter,
  setSelectedCourseFilter,
  currentUser,
}) => {
  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const studentFirstName = currentUser ? currentUser.name.split(' ')[0] : 'Rekan Mahasiswa';
  const todayStr = new Date().toISOString().split('T')[0];

  const pendingCount = tasks.filter((t) => t.status !== 'done').length;
  const urgentCount = tasks.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done'
  ).length;
  const todayCount = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'done'
  ).length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="space-y-5">
      {/* Greeting & Quick Motivation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-accent-100 tracking-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-plum-600 via-plum-500 to-gold-500 bg-clip-text text-transparent">{studentFirstName}</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
            {currentUser ? (
              <>
                <span className="font-semibold text-slate-700 dark:text-accent-200">{currentUser.major}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-100 dark:bg-plum-900/60 text-plum-900 dark:text-gold-300 font-bold text-[11px] border border-plum-200/60 dark:border-plum-800/70 shadow-xs">
                  Semester {currentUser.semester}
                </span>
                <span>•</span>
                <span>{currentUser.university}</span>
              </>
            ) : (
              'Manajemen penugasan, jadwal mata kuliah, dan perencanaan akademik.'
            )}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards with Plum, Gold, and Accent White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pending Tasks (Plum Theme) */}
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'all'
              ? 'ring-2 ring-plum-500/40 border-plum-600 bg-gradient-to-br from-plum-100/90 via-accent-100/60 to-white dark:from-plum-950/70 dark:via-plum-900/40 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-plum-900/80 bg-gradient-to-br from-plum-50/50 via-white to-white dark:from-plum-950/30 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-plum-300 dark:hover:border-plum-700/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Tugas Aktif</span>
            <div className="w-7 h-7 rounded-xl bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-accent-100 flex items-center justify-center shadow-xs border border-plum-200/50 dark:border-plum-800">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-plum-950 dark:text-accent-100 mt-2 font-mono tracking-tight">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Perlu diselesaikan
          </span>
        </div>

        {/* Due Today (Gold Theme) */}
        <div
          onClick={() => setFilterStatus('today')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'today'
              ? 'ring-2 ring-gold-500/50 border-gold-500 bg-gradient-to-br from-gold-100/90 via-accent-100/60 to-white dark:from-gold-950/50 dark:via-gold-900/30 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-plum-900/80 bg-gradient-to-br from-gold-50/40 via-white to-white dark:from-gold-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-gold-300 dark:hover:border-gold-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Deadline Hari Ini</span>
            <div className="w-7 h-7 rounded-xl bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-300 flex items-center justify-center shadow-xs border border-gold-200/50 dark:border-gold-800">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-gold-900 dark:text-gold-300 mt-2 font-mono tracking-tight">
            {todayCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Tenggat waktu hari ini
          </span>
        </div>

        {/* Urgent & High Priority (Plum-Gold Accent) */}
        <div
          onClick={() => setFilterStatus('urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'urgent'
              ? 'ring-2 ring-plum-600/50 border-plum-600 bg-gradient-to-br from-plum-100/90 via-gold-50/50 to-white dark:from-plum-950/60 dark:via-plum-900/40 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-plum-900/80 bg-gradient-to-br from-plum-50/40 via-white to-white dark:from-plum-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-plum-300 dark:hover:border-plum-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Prioritas Tinggi</span>
            <div className="w-7 h-7 rounded-xl bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-gold-300 flex items-center justify-center shadow-xs border border-plum-200/50 dark:border-plum-800">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-plum-900 dark:text-gold-400 mt-2 font-mono tracking-tight">
            {urgentCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Mendesak / Bobot besar
          </span>
        </div>

        {/* Completed Tasks (Accent White / Mint) */}
        <div
          onClick={() => setFilterStatus('done')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'done'
              ? 'ring-2 ring-accent-300 border-accent-400 bg-gradient-to-br from-accent-100/90 via-emerald-50/40 to-white dark:from-plum-950/50 dark:via-emerald-950/20 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-plum-900/80 bg-gradient-to-br from-accent-50/60 via-white to-white dark:from-plum-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-accent-300 dark:hover:border-plum-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Tugas Selesai</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950 dark:text-white mt-2 font-mono tracking-tight">
            {doneCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Tuntas dikumpulkan
          </span>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and View Mode Switcher */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-plum-950/60 border border-slate-200/80 dark:border-plum-900/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, laporan, kuis, atau matkul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-accent-100/50 dark:bg-plum-900/40 border border-slate-200 dark:border-plum-800 text-slate-900 dark:text-accent-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-plum-500/20 focus:border-plum-600 transition"
          />
        </div>

        {/* Filters & View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Course Dropdown */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-accent-100/50 dark:bg-plum-900/40 border border-slate-200 dark:border-plum-800 text-slate-700 dark:text-accent-100 font-semibold focus:outline-none"
          >
            <option value="all">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
            <option value="org">Organisasi / UKM</option>
            <option value="skripsi">Skripsi / Tugas Akhir</option>
            <option value="general">Umum / Pribadi</option>
          </select>

          {/* Quick status filter pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-accent-100/80 dark:bg-plum-900/40 border border-slate-200/60 dark:border-plum-800/60">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'all'
                  ? 'bg-plum-600 text-accent-100 shadow-xs border border-gold-400/40'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'today'
                  ? 'bg-gold-500 text-plum-950 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'urgent'
                  ? 'bg-plum-700 text-gold-300 border border-gold-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
              }`}
            >
              Mendesak
            </button>
            <button
              onClick={() => setFilterStatus('done')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterStatus === 'done'
                  ? 'bg-accent-200 text-plum-950 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
              }`}
            >
              Selesai
            </button>
          </div>

          {/* View Mode Toggle: List vs Kanban */}
          <div className="flex items-center p-0.5 rounded-xl bg-accent-100/80 dark:bg-plum-900/40 border border-slate-200/60 dark:border-plum-800/60">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-plum-600 text-accent-100 shadow-xs'
                  : 'text-slate-400 hover:text-plum-800 dark:hover:text-accent-100'
              }`}
              title="Tampilan Daftar (List)"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban'
                  ? 'bg-plum-600 text-accent-100 shadow-xs'
                  : 'text-slate-400 hover:text-plum-800 dark:hover:text-accent-100'
              }`}
              title="Tampilan Papan Kanban"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
