import React, { useState } from 'react';
import type { Course, Task, DayOfWeek } from '../types';
import { Calendar, Clock, MapPin, User, Plus, Edit2 } from 'lucide-react';
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
      {/* Top Banner / Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-soft-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
            Jadwal Perkuliahan Semester
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
            Agenda Kelas & Ruangan Kuliah
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
            Total {courses.length} Mata Kuliah aktif ({totalSks} SKS). Pantau ruang & dosen pengampu.
          </p>
        </div>

        <button
          onClick={onOpenCourseModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Kelola Mata Kuliah</span>
        </button>
      </div>

      {/* Day Selector Pills for Mobile & Quick Switch */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === todayName;
          const dayCount = courses.filter((c) => c.day === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}
                >
                  Hari Ini
                </span>
              )}
              {dayCount > 0 && (
                <span
                  className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    isSelected ? 'bg-white text-blue-600' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {dayCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Grid Layout (Desktop) & Detail Selected Day (Mobile/Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule for the selected day */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jadwal Hari {selectedDay}</span>
              {selectedDay === todayName && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                  Sedang Berlangsung Hari Ini
                </span>
              )}
            </h3>
          </div>

          {courses.filter((c) => c.day === selectedDay).length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center bg-white dark:bg-zinc-900">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                Tidak ada jadwal kuliah di hari {selectedDay}
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Waktu yang tepat untuk fokus menyelesaikan tugas atau belajar mandiri!
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
                    className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft hover:shadow-soft-lg transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${styling.badge} ${styling.border}`}
                          >
                            {course.code}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                            {course.sks} SKS
                          </span>
                          {course.targetGrade && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              Target: {course.targetGrade}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {course.name}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>
                              {course.startTime} - {course.endTime} WIB
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="truncate">{course.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Dosen: {course.lecturer}</span>
                          </div>
                        </div>

                        {relatedTasks.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              ⚠️ {relatedTasks.length} Tugas aktif untuk matkul ini
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onEditCourse(course)}
                        className="opacity-60 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Ringkasan Mingguan (Semua Hari)
          </h3>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 space-y-3 shadow-soft">
            {DAYS.map((day) => {
              const dayCourses = courses.filter((c) => c.day === day);
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                    selectedDay === day
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-zinc-200 mb-1">
                    <span>{day}</span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {dayCourses.length} Kelas
                    </span>
                  </div>

                  {dayCourses.length === 0 ? (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
                      Libur / Tidak ada kelas
                    </span>
                  ) : (
                    <div className="space-y-1">
                      {dayCourses.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400 truncate"
                        >
                          <span className="truncate max-w-[170px]">{c.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{c.startTime}</span>
                        </div>
                      ))}
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
