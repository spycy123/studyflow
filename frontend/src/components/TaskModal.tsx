import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import type { Task, Course, Priority, TaskCategory, Subtask, Attachment } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editingTask: Task | null;
  courses: Course[];
  onOpenCourseModal: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  courses,
  onOpenCourseModal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('general');
  const [category, setCategory] = useState<TaskCategory>('tugas');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCourseId(editingTask.courseId);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '23:59');
      setSubtasks(editingTask.subtasks || []);
      setAttachments(editingTask.attachments || []);
    } else {
      // Default new task
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTitle('');
      setDescription('');
      setCourseId(courses.length > 0 ? courses[0].id : 'general');
      setCategory('tugas');
      setPriority('medium');
      setDueDate(tomorrow.toISOString().split('T')[0]);
      setDueTime('23:59');
      setSubtasks([]);
      setAttachments([]);
    }
    setShowAddLink(false);
    setNewSubtaskTitle('');
    setNewLinkTitle('');
    setNewLinkUrl('');
  }, [editingTask, isOpen, courses]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const item: Subtask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, item]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    let url = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    const item: Attachment = {
      title: newLinkTitle.trim() || url,
      url,
    };
    setAttachments([...attachments, item]);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLink(false);
  };

  const handleRemoveLink = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const taskData: Task = {
      id: editingTask ? editingTask.id : 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      courseId,
      category,
      priority,
      status: editingTask ? editingTask.status : 'todo',
      dueDate,
      dueTime: dueTime || undefined,
      subtasks,
      attachments,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      completedAt: editingTask ? editingTask.completedAt : undefined,
    };

    onSave(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              {editingTask ? 'Edit Tugas Perkuliahan' : 'Catat Tugas Baru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Kelola detail tenggat waktu, sub-langkah, dan lampiran link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
              Judul Tugas / Aktivitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Laporan Praktikum Modul 4, Makalah Kelompok, dll."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Course & Category in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                  Mata Kuliah / Asosiasi
                </label>
                <button
                  type="button"
                  onClick={onOpenCourseModal}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Matkul Baru
                </button>
              </div>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <optgroup label="Mata Kuliah Semester Ini">
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Lainnya">
                  <option value="org">Organisasi / BEM / UKM</option>
                  <option value="skripsi">Tugas Akhir / Skripsi / Magang</option>
                  <option value="general">Umum / Pribadi / Keuangan</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Jenis Kegiatan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="tugas">Tugas Kuliah</option>
                <option value="laporan">Laporan / Praktikum</option>
                <option value="kuis">Kuis / Responsi</option>
                <option value="proyek">Proyek / Tugas Besar (Tubes)</option>
                <option value="uts_uas">UTS / UAS</option>
                <option value="skripsi">Skripsi / Proposal</option>
                <option value="organisasi">Rapat Organisasi</option>
                <option value="lainnya">Lain-lain</option>
              </select>
            </div>
          </div>

          {/* Deadline Date, Time & Priority in 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Tenggat Tanggal <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Jam Deadline
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              >
                <option value="urgent">Mendesak (Tenggat Dekat)</option>
                <option value="high">Tinggi (Penting)</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
              Catatan / Instruksi Pengerjaan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Detail materi, batasan halaman, format pengumpulan file..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Subtasks (Checklist) */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                Sub-tugas / Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </label>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5 max-h-36 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={(e) => {
                          setSubtasks(
                            subtasks.map((item) =>
                              item.id === st.id ? { ...item, completed: e.target.checked } : item
                            )
                          );
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`text-xs truncate ${
                          st.completed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-zinc-200'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah sub-langkah (e.g. Cari 3 jurnal, Bab 1, Review)..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl transition font-medium"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Attachments / Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                Tautan / Referensi Kuliah
              </label>
              {!showAddLink && (
                <button
                  type="button"
                  onClick={() => setShowAddLink(true)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Link
                </button>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {attachments.map((link, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px]"
                  >
                    <LinkIcon className="w-3 h-3 text-blue-500" />
                    <span className="truncate max-w-[140px] font-medium">{link.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="hover:text-rose-600 ml-1 text-slate-400"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddLink && (
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
                <input
                  type="text"
                  placeholder="Nama Link (Contoh: Google Drive Kelompok, E-learning)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="URL (https://drive.google.com/...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddLink(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 dark:text-zinc-400"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Simpan Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition"
          >
            {editingTask ? 'Perbarui Tugas' : 'Simpan Tugas'}
          </button>
        </div>
      </div>
    </div>
  );
};
