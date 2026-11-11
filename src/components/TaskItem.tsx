import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Trash2,
  Edit2,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Course } from '../types';
import { getCategoryLabel, getPriorityBadge, getCourseColorClasses, formatDeadlineText } from '../utils/formatters';
import { soundEffects } from '../utils/audio';

interface TaskItemProps {
  task: Task;
  course?: Course;
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onStartFocus: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  course,
  onToggleStatus,
  onEdit,
  onDelete,
  onUpdateSubtask,
  onStartFocus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isDone = task.status === 'done';
  const priorityBadge = getPriorityBadge(task.priority);
  const courseStyle = course ? getCourseColorClasses(course.color) : null;
  const deadline = formatDeadlineText(task.dueDate, task.dueTime);

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleToggle = () => {
    soundEffects.playClick();
    if (!isDone) {
      soundEffects.playTaskComplete();
      // Trigger festive confetti if urgent or high priority
      if (task.priority === 'urgent' || task.priority === 'high') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
    onToggleStatus(task.id);
  };

  const getCourseDisplayName = () => {
    if (course) return course.name;
    if (task.courseId === 'org') return 'Organisasi / UKM';
    if (task.courseId === 'skripsi') return 'Tugas Akhir / Skripsi';
    return 'Umum / Perkuliahan';
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        isDone
          ? 'bg-slate-50/70 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/60 opacity-80'
          : deadline.isOverdue
          ? 'bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/40 shadow-sm'
          : deadline.isToday
          ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/80 dark:border-amber-900/40 shadow-sm'
          : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-soft hover:shadow-soft-lg hover:border-slate-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Complete Status Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition transform active:scale-90"
            title={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
          >
            {isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/15" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 hover:text-blue-500" />
            )}
          </button>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Badges: Course, Category, Priority */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {/* Course badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  courseStyle
                    ? `${courseStyle.badge} ${courseStyle.border}`
                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                }`}
              >
                {getCourseDisplayName()}
              </span>

              {/* Category */}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                {getCategoryLabel(task.category)}
              </span>

              {/* Priority */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${priorityBadge.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityBadge.dot}`} />
                {priorityBadge.label}
              </span>
            </div>

            {/* Task Title */}
            <h3
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm sm:text-base font-semibold cursor-pointer tracking-tight transition ${
                isDone
                  ? 'line-through text-slate-400 dark:text-zinc-500'
                  : 'text-slate-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Description Preview (if any) */}
            {task.description && !isExpanded && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
                {task.description}
              </p>
            )}

            {/* Expanded Description & Attachments */}
            {isExpanded && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5 animate-in fade-in duration-150">
                {task.description && (
                  <p className="text-xs text-slate-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                    {task.description}
                  </p>
                )}

                {/* Attachments / links */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 block">
                      Tautan Referensi:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {task.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{att.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subtasks Progress Bar & Checklist */}
            {totalSubtasks > 0 && (
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Layers className="w-3 h-3" />
                    Progres Sub-langkah: {completedSubtasks}/{totalSubtasks}
                  </span>
                  <span>{Math.round(subtaskProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      subtaskProgress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${subtaskProgress}%` }}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-2 space-y-1 pl-1">
                    {task.subtasks.map((st) => (
                      <label
                        key={st.id}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 py-0.5 cursor-pointer hover:opacity-80"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={(e) => onUpdateSubtask(task.id, st.id, e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span
                          className={
                            st.completed ? 'line-through text-slate-400 dark:text-zinc-500' : ''
                          }
                        >
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Metadata: Deadline & Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs border-t border-slate-100/80 dark:border-zinc-800/60">
              {/* Deadline Indicator */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span
                  className={`font-medium ${
                    isDone
                      ? 'text-slate-400 dark:text-zinc-500'
                      : deadline.isOverdue
                      ? 'text-rose-600 dark:text-rose-400 font-semibold'
                      : deadline.isToday
                      ? 'text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {deadline.text}
                </span>
                {deadline.isOverdue && !isDone && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    Terlambat
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {/* Focus Timer Trigger Button */}
                {!isDone && (
                  <button
                    type="button"
                    onClick={() => onStartFocus(task)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition"
                    title="Mulai sesi fokus Pomodoro untuk tugas ini"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Fokus</span>
                  </button>
                )}

                {/* Expand / Collapse toggle */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-lg transition"
                  title={isExpanded ? 'Ciutkan rincian' : 'Buka rincian'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Options Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-lg transition"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 bottom-full mb-1 w-36 py-1 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-700 z-40 text-xs animate-in fade-in duration-100">
                        <button
                          onClick={() => {
                            onEdit(task);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition text-left"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Edit Tugas</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tugas "${task.title}"?`)) {
                              onDelete(task.id);
                            }
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
