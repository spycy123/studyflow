import React, { useState } from 'react';
import type { Course, Task, DayOfWeek } from '../types';
import { Calendar, Clock, MapPin, User, Plus, Edit2, BookOpen } from 'lucide-react';
import { getCourseColorClasses } from '../utils/formatters';

interface ScheduleViewProps {
  courses: Course[];
  tasks: Task[];
  onOpenCourseModal: () => void;
  onEditCourse: (course: Course) => void;
}

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  courses,
  tasks,
  onOpenCourseModal,
  onEditCourse,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');

  // Detect current day of week in Indonesian
  const dayNamesIndo: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayIdx = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const todayName: DayOfWeek = todayIdx === 0 ? 'Senin' : dayNamesIndo[todayIdx - 1];

  const totalSks = courses.reduce((acc, c) => acc + (c.sks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary with Elegant Academic Gradient */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 dark:from-zinc-900 dark:via-indigo-950 dark:to-zinc-900 border border-indigo-900/40 text-white shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle background glow circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
              Jadwal Kuliah Mingguan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Agenda Perkuliahan & Ruangan Kelas
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Total <span className="font-bold text-white">{courses.length} Mata Kuliah</span> terdaftar semester ini dengan beban <span className="font-bold text-white">{totalSks} SKS</span>.
          </p>
        </div>

        <button
          onClick={onOpenCourseModal}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Kelola Mata Kuliah</span>
        </button>
      </div>

      {/* Day Selector Pills with Colorful Accents */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === todayName;
          const dayCount = courses.filter((c) => c.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40'
                  }`}
                >
                  Hari Ini
                </span>
              )}
              {dayCount > 0 && (
                <span
                  className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isSelected
                      ? 'bg-white text-blue-600'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {dayCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule for the selected day */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jadwal Kuliah Hari {selectedDay}</span>
              {selectedDay === todayName && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                  ● Sedang Berlangsung Hari Ini
                </span>
              )}
            </h3>
          </div>

          {courses.filter((c) => c.day === selectedDay).length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center bg-white dark:bg-zinc-900">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                Tidak ada jadwal kuliah di hari {selectedDay}
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Waktu yang tepat untuk fokus menyelesaikan tugas, riset, atau belajar mandiri!
              </p>
            </div>
          ) : (
            courses
              .filter((c) => c.day === selectedDay)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((course) => {
                const styling = getCourseColorClasses(course.color);
                const relatedTasks = tasks.filter(
                  (t) => t.courseId === course.id && t.status !== 'done'
                );

                return (
                  <div
                    key={course.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 border-l-[4px] ${styling.borderAccent} shadow-soft hover:shadow-soft-lg transition group`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md border ${styling.badge}`}
                          >
                            {course.code}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                            {course.sks} SKS
                          </span>
                          {course.targetGrade && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                              Target Nilai: {course.targetGrade}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {course.name}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>
                              {course.startTime} - {course.endTime} WIB
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="truncate">{course.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-500 dark:text-zinc-400">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Dosen: {course.lecturer}</span>
                          </div>
                        </div>

                        {relatedTasks.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800 text-xs">
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40 inline-flex items-center gap-1">
                              {relatedTasks.length} tugas aktif untuk mata kuliah ini
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onEditCourse(course)}
                        className="opacity-70 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
                        title="Edit jadwal matkul"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Right Col: Weekly Overview Map */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Ringkasan Mingguan</span>
          </h3>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 space-y-2.5 shadow-soft">
            {DAYS.map((day) => {
              const dayCourses = courses.filter((c) => c.day === day);
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    selectedDay === day
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs'
                      : 'border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-zinc-200 mb-1">
                    <span>{day}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        dayCourses.length > 0
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500'
                      }`}
                    >
                      {dayCourses.length} Kelas
                    </span>
                  </div>

                  {dayCourses.length === 0 ? (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                      Libur / Tidak ada jadwal kelas
                    </span>
                  ) : (
                    <div className="space-y-1 mt-1.5">
                      {dayCourses.map((c) => {
                        const style = getCourseColorClasses(c.color);
                        return (
                          <div
                            key={c.id}
                            className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${style.indicator}`} />
                              <span className="truncate max-w-[150px] font-medium">{c.name}</span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                              {c.startTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
