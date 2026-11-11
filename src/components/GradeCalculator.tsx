import React from 'react';
import type { Course, Task } from '../types';
import { Award, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface GradeCalculatorProps {
  courses: Course[];
  tasks: Task[];
  onUpdateCourseGrade: (courseId: string, grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E') => void;
}

const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  AB: 3.5,
  B: 3.0,
  BC: 2.5,
  C: 2.0,
  D: 1.0,
  E: 0.0,
};

export const GradeCalculator: React.FC<GradeCalculatorProps> = ({
  courses,
  tasks,
  onUpdateCourseGrade,
}) => {
  // Calculate Target IPS (Indeks Prestasi Semester)
  let totalGradePoints = 0;
  let totalSks = 0;

  courses.forEach((c) => {
    const points = GRADE_POINTS[c.targetGrade || 'A'] ?? 4.0;
    totalGradePoints += points * c.sks;
    totalSks += c.sks;
  });

  const projectedIps = totalSks > 0 ? (totalGradePoints / totalSks).toFixed(2) : '0.00';
  const ipsNumber = parseFloat(projectedIps);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner IPS Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GPA Projection Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-soft-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <span>Proyeksi IPS Semester</span>
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-4xl sm:text-5xl font-black mt-3 font-mono">
              {projectedIps}
            </div>
            <p className="text-xs text-blue-100 mt-2">
              {ipsNumber >= 3.8
                ? '🌟 Luar biasa! Berpotensi Cum Laude / Dean\'s List.'
                : ipsNumber >= 3.5
                ? '👍 Sangat memuaskan. Pertahankan performa tugas & kuis!'
                : ipsNumber >= 3.0
                ? '📚 Cukup baik. Masih bisa didongkrak lewat tugas besar.'
                : '⚠️ Perlu perbaikan target nilai pada beberapa matkul.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-500/40 text-xs text-blue-200">
            Total Beban: <span className="font-bold text-white">{totalSks} SKS</span>
          </div>
        </div>

        {/* Task Completion Rate Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <span>Penyelesaian Tugas Kuliah</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-4xl sm:text-5xl font-black mt-3 font-mono text-slate-900 dark:text-white">
              {taskCompletionRate}%
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
              {completedTasks} dari {totalTasks} tugas & agenda berhasil diselesaikan.
            </p>
          </div>

          <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Study Strategy / Tip Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <span>Prinsip Belajar Mahasiswa</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Aturan 80/20 di Perkuliahan
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
              20% usaha terpenting (mengumpulkan tugas tepat waktu & aktif di kelas) menghasilkan 80% poin nilai akhir semester. Hindari sistem kebut semalam (SKS)!
            </p>
          </div>

          <div className="mt-4 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            💡 Tips: Kerjakan tugas yang bernilai bobot besar terlebih dahulu.
          </div>
        </div>
      </div>

      {/* Target Grade Simulator Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Simulasi Target Nilai per Mata Kuliah
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Ubah target nilai untuk melihat langsung pengaruhnya terhadap prediksi Indeks Prestasi Semester (IPS).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Kode & Mata Kuliah</th>
                <th className="py-3 px-3">SKS</th>
                <th className="py-3 px-3">Tugas Tertunda</th>
                <th className="py-3 px-3">Target Nilai</th>
                <th className="py-3 px-3 text-right">Bobot Mutu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {courses.map((course) => {
                const pendingTasks = tasks.filter(
                  (t) => t.courseId === course.id && t.status !== 'done'
                ).length;
                const points = GRADE_POINTS[course.targetGrade || 'A'] ?? 4.0;
                const totalQualityPoints = (points * course.sks).toFixed(1);

                return (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {course.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {course.code} • {course.lecturer}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-zinc-300">
                      {course.sks} SKS
                    </td>
                    <td className="py-3 px-3">
                      {pendingTasks > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {pendingTasks} tugas
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Bersih
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={course.targetGrade || 'A'}
                        onChange={(e) =>
                          onUpdateCourseGrade(course.id, e.target.value as any)
                        }
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold text-blue-600 dark:text-blue-400 focus:outline-none"
                      >
                        <option value="A">A (4.00)</option>
                        <option value="AB">AB (3.50)</option>
                        <option value="B">B (3.00)</option>
                        <option value="BC">BC (2.50)</option>
                        <option value="C">C (2.00)</option>
                        <option value="D">D (1.00)</option>
                        <option value="E">E (0.00)</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 dark:text-zinc-200">
                      {totalQualityPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-zinc-800 font-bold text-slate-900 dark:text-white">
                <td className="py-3.5 px-3">Total Kumulatif</td>
                <td className="py-3.5 px-3">{totalSks} SKS</td>
                <td className="py-3.5 px-3"></td>
                <td className="py-3.5 px-3 text-slate-500 dark:text-zinc-400 font-normal">
                  Hasil Prediksi IPS:
                </td>
                <td className="py-3.5 px-3 text-right text-base text-blue-600 dark:text-blue-400 font-mono">
                  {projectedIps}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
