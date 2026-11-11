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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{studentFirstName}</span>! 🎓
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
            {currentUser ? (
              <>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">{currentUser.major}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold text-[11px] border border-blue-200/50 dark:border-blue-800/40">
                  Semester {currentUser.semester}
                </span>
                <span>•</span>
                <span>{currentUser.university}</span>
              </>
            ) : (
              'Kelola tugas kuliah, praktikum, dan agenda organisasi dengan teratur tanpa stres.'
            )}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards with Subtle Harmonic Gradients (Not Alay) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pending Tasks (Indigo / Blue) */}
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'all'
              ? 'ring-2 ring-indigo-500/30 border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-blue-50/40 to-white dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-indigo-50/40 via-white to-white dark:from-indigo-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-indigo-300 dark:hover:border-indigo-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Tugas Aktif</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-950 dark:text-white mt-2 font-mono tracking-tight">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Perlu diselesaikan
          </span>
        </div>

        {/* Due Today (Amber / Sunbeam) */}
        <div
          onClick={() => setFilterStatus('today')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'today'
              ? 'ring-2 ring-amber-500/30 border-amber-500 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white dark:from-amber-950/40 dark:via-orange-950/20 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-amber-300 dark:hover:border-amber-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Deadline Hari Ini</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-950 dark:text-white mt-2 font-mono tracking-tight">
            {todayCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Tenggat waktu hari ini
          </span>
        </div>

        {/* Urgent & High Priority (Rose / Coral) */}
        <div
          onClick={() => setFilterStatus('urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'urgent'
              ? 'ring-2 ring-rose-500/30 border-rose-500 bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white dark:from-rose-950/40 dark:via-pink-950/20 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-rose-50/40 via-white to-white dark:from-rose-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-rose-300 dark:hover:border-rose-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Prioritas Tinggi</span>
            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-950 dark:text-white mt-2 font-mono tracking-tight">
            {urgentCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Mendesak / Bobot besar
          </span>
        </div>

        {/* Completed Tasks (Emerald / Mint) */}
        <div
          onClick={() => setFilterStatus('done')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
            filterStatus === 'done'
              ? 'ring-2 ring-emerald-500/30 border-emerald-500 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-zinc-900 shadow-soft'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-zinc-900 dark:to-zinc-900 shadow-soft hover:shadow-soft-lg hover:border-emerald-300 dark:hover:border-emerald-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Tugas Selesai</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shadow-xs">
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
      <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, laporan, kuis, atau matkul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Filters & View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Course Dropdown */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 font-semibold focus:outline-none"
          >
            <option value="all">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
            <option value="org">🏛️ Organisasi / UKM</option>
            <option value="skripsi">🎓 Skripsi / TA</option>
            <option value="general">📌 Umum / Pribadi</option>
          </select>

          {/* Quick status filter pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('today')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === 'today'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === 'urgent'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Mendesak
            </button>
            <button
              onClick={() => setFilterStatus('done')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === 'done'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Selesai
            </button>
          </div>

          {/* View Mode Toggle: List vs Kanban */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Tampilan Daftar (List)"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
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
