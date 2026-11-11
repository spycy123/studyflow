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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {studentFirstName}! 🎓
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            {currentUser
              ? `${currentUser.major} • Semester ${currentUser.semester} • ${currentUser.university}`
              : 'Kelola tugas kuliah, praktikum, dan agenda organisasi dengan teratur tanpa stres.'}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Pending Tasks */}
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'all'
              ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-soft hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold">Tugas Aktif</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
            Perlu dikerjakan
          </span>
        </div>

        {/* Due Today */}
        <div
          onClick={() => setFilterStatus('today')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'today'
              ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-soft hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold">Deadline Hari Ini</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {todayCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
            Tenggat waktu hari ini
          </span>
        </div>

        {/* Urgent & High Priority */}
        <div
          onClick={() => setFilterStatus('urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'urgent'
              ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-soft hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold">Prioritas Tinggi</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {urgentCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
            Mendesak / Nilai besar
          </span>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => setFilterStatus('done')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            filterStatus === 'done'
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-soft hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-xs font-semibold">Tugas Selesai</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {doneCount}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
            Tuntas dikumpulkan
          </span>
        </div>
      </div>

      {/* Control Bar: Search, Category Filter, and View Mode Switcher */}
      <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, laporan, kuis, atau matkul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters & View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Course Dropdown */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 font-medium focus:outline-none"
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
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('today')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'today'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'urgent'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
            >
              Mendesak
            </button>
            <button
              onClick={() => setFilterStatus('done')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'done'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400'
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
