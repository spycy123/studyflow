import React, { useState, useEffect } from 'react';
import { X, BookOpen, Trash2 } from 'lucide-react';
import type { Course, DayOfWeek } from '../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  editingCourse?: Course | null;
}

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Biru', bg: 'bg-blue-500' },
  { id: 'emerald', label: 'Hijau Zamrud', bg: 'bg-emerald-500' },
  { id: 'violet', label: 'Ungu', bg: 'bg-purple-500' },
  { id: 'amber', label: 'Oranye / Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Merah Muda / Rose', bg: 'bg-rose-500' },
  { id: 'cyan', label: 'Sian / Toska', bg: 'bg-cyan-500' },
];

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSaveCourse,
  onDeleteCourse,
  editingCourse,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [sks, setSks] = useState(3);
  const [day, setDay] = useState<DayOfWeek>('Senin');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState('blue');
  const [targetGrade, setTargetGrade] = useState<'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E'>('A');

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (editingCourse) {
      setActiveCourseId(editingCourse.id);
      setCode(editingCourse.code);
      setName(editingCourse.name);
      setLecturer(editingCourse.lecturer);
      setSks(editingCourse.sks);
      setDay(editingCourse.day);
      setStartTime(editingCourse.startTime);
      setEndTime(editingCourse.endTime);
      setRoom(editingCourse.room);
      setColor(editingCourse.color);
      setTargetGrade(editingCourse.targetGrade || 'A');
    } else {
      resetForm();
    }
  }, [editingCourse, isOpen]);

  const resetForm = () => {
    setActiveCourseId(null);
    setCode('');
    setName('');
    setLecturer('');
    setSks(3);
    setDay('Senin');
    setStartTime('08:00');
    setEndTime('10:30');
    setRoom('');
    setColor('blue');
    setTargetGrade('A');
  };

  const handleSelectToEdit = (course: Course) => {
    setActiveCourseId(course.id);
    setCode(course.code);
    setName(course.name);
    setLecturer(course.lecturer);
    setSks(course.sks);
    setDay(course.day);
    setStartTime(course.startTime);
    setEndTime(course.endTime);
    setRoom(course.room);
    setColor(course.color);
    setTargetGrade(course.targetGrade || 'A');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const courseData: Course = {
      id: activeCourseId || 'course-' + Date.now(),
      code: code.trim().toUpperCase() || 'MK' + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      lecturer: lecturer.trim() || 'Dosen Pengampu',
      sks: Number(sks) || 3,
      day,
      startTime,
      endTime,
      room: room.trim() || 'Ruang Kuliah',
      color,
      targetGrade,
    };

    onSaveCourse(courseData);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Kelola Mata Kuliah Semester Ini
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Atur jadwal mingguan, SKS, dosen, dan target nilai akademik.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with 2 sections: Course List & Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick List of existing courses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Daftar Mata Kuliah Terdaftar ({courses.length})
              </h3>
              {activeCourseId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Tambah Matkul Baru
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {courses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectToEdit(c)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between group ${
                    activeCourseId === c.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                        {c.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {c.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      {c.day}, {c.startTime} • {c.sks} SKS
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus mata kuliah "${c.name}"?`)) {
                        onDeleteCourse(c.id);
                        if (activeCourseId === c.id) resetForm();
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 transition"
                    title="Hapus mata kuliah"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-800/30 space-y-4"
          >
            <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
              {activeCourseId ? 'Edit Mata Kuliah Terpilih' : 'Form Tambah Mata Kuliah Baru'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Kode Matkul
                </label>
                <input
                  type="text"
                  placeholder="IF2102"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Nama Mata Kuliah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Berorientasi Objek"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Dosen Pengampu
                </label>
                <input
                  type="text"
                  placeholder="Nama & Gelar Dosen"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Bobot SKS
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={sks}
                  onChange={(e) => setSks(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Hari
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Target Nilai
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-semibold text-blue-600 dark:text-blue-400"
                >
                  <option value="A">A (4.00)</option>
                  <option value="AB">AB (3.50)</option>
                  <option value="B">B (3.00)</option>
                  <option value="BC">BC (2.50)</option>
                  <option value="C">C (2.00)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Ruang Kelas / Gedung / Zoom Link
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lab Komputer 302, GKU Lt.2"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Warna Kartu
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={`w-6 h-6 rounded-full ${c.bg} transition-all ${
                        color === c.id ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {activeCourseId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                >
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
              >
                {activeCourseId ? 'Simpan Perubahan Matkul' : '+ Tambah Mata Kuliah'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
