import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Moon,
  Sun,
  CalendarDays,
  CheckSquare,
  Timer,
  Calculator,
  RotateCcw,
  Download,
  Upload,
  Settings,
  LogOut,
  ChevronDown,
  Building,
} from 'lucide-react';
import type { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'tasks' | 'schedule' | 'pomodoro' | 'grades';
  setCurrentTab: (tab: 'tasks' | 'schedule' | 'pomodoro' | 'grades') => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  onOpenTaskModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  taskCounts: {
    pending: number;
    urgent: number;
  };
  currentUser: UserProfile;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDark,
  toggleDarkMode,
  onOpenTaskModal,
  onResetData,
  onExportData,
  onImportData,
  taskCounts,
  currentUser,
  onLogout,
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs: {
    id: 'tasks' | 'schedule' | 'pomodoro' | 'grades';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'tasks',
      label: 'Tugas & Agenda',
      icon: CheckSquare,
      badge: taskCounts.pending > 0 ? taskCounts.pending : undefined,
    },
    {
      id: 'schedule',
      label: 'Jadwal Kuliah',
      icon: CalendarDays,
    },
    {
      id: 'pomodoro',
      label: 'Fokus Nugas',
      icon: Timer,
    },
    {
      id: 'grades',
      label: 'Simulasi IPK',
      icon: Calculator,
    },
  ];

  // Get initials from user name (e.g. "Fajar Pratama" -> "FP")
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  StudyFlow
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Kampus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden sm:block">
                Agenda & To-Do Mahasiswa
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-zinc-800/70 border border-slate-200/60 dark:border-zinc-700/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 relative ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-900 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* New Task Button */}
            <button
              onClick={onOpenTaskModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition-all duration-150"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Tambah Tugas</span>
              <span className="sm:hidden">Tugas</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Settings & Data Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
                title="Cadangkan / Opsi Data"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettingsDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettingsDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 py-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800/80">
                      Penyimpanan Data Lokal
                    </div>

                    <button
                      onClick={() => {
                        onExportData();
                        setShowSettingsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-left"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-500" />
                      <span>Cadangkan Data (JSON)</span>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowSettingsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-left"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Pulihkan Data (JSON)</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />

                    <button
                      onClick={() => {
                        if (confirm('Kembalikan ke data contoh perkuliahan awal? Perubahan saat ini akan di-reset.')) {
                          onResetData();
                        }
                        setShowSettingsDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Data Contoh</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Student Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(currentUser.name)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-400 font-mono leading-none">
                    {currentUser.nim}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    {/* User Profile Card Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {getInitials(currentUser.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">
                          NIM: {currentUser.nim}
                        </div>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="py-2.5 space-y-1.5 text-slate-600 dark:text-zinc-300 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{currentUser.major}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>Semester {currentUser.semester} • {currentUser.university}</span>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          if (confirm('Keluar dari akun mahasiswa ini?')) {
                            onLogout();
                          }
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition text-left font-semibold text-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar / Ganti Akun</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-1.5 border-t border-slate-100 dark:border-zinc-800/80 pt-2 -mx-2 px-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
