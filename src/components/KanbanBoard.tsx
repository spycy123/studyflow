import React from 'react';
import type { Task, Course, TaskStatus } from '../types';
import { TaskItem } from './TaskItem';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  courses: Course[];
  onToggleStatus: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onStartFocus: (task: Task) => void;
  onMoveStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: {
  id: TaskStatus;
  title: string;
  bg: string;
  border: string;
  badge: string;
  dot: string;
}[] = [
  {
    id: 'todo',
    title: 'Belum Dimulai',
    bg: 'bg-gradient-to-b from-slate-100/70 via-slate-50/40 to-slate-50/10 dark:from-zinc-900/80 dark:to-zinc-900/20',
    border: 'border-slate-200 dark:border-zinc-800',
    badge: 'bg-slate-200/70 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    dot: 'bg-slate-400',
  },
  {
    id: 'in_progress',
    title: 'Sedang Dikerjakan',
    bg: 'bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-blue-50/10 dark:from-blue-950/30 dark:to-zinc-900/20',
    border: 'border-blue-200/80 dark:border-blue-900/50',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  {
    id: 'review',
    title: 'Review & Revisi',
    bg: 'bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-50/10 dark:from-amber-950/30 dark:to-zinc-900/20',
    border: 'border-amber-200/80 dark:border-amber-900/50',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  {
    id: 'done',
    title: 'Selesai',
    bg: 'bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-emerald-50/10 dark:from-emerald-950/30 dark:to-zinc-900/20',
    border: 'border-emerald-200/80 dark:border-emerald-900/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  courses,
  onToggleStatus,
  onEdit,
  onDelete,
  onUpdateSubtask,
  onStartFocus,
  onMoveStatus,
}) => {
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'done') return 'review';
    if (current === 'review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`rounded-3xl border ${col.border} p-4 flex flex-col min-h-[460px] ${col.bg} transition-all shadow-soft`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shadow-xs`} />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide">
                  {col.title}
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge} shadow-xs`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200/70 dark:border-zinc-800 rounded-2xl">
                  <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">
                    Tidak ada tugas
                  </span>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const course = courseMap.get(task.courseId);
                  const nextStatus = getNextStatus(task.status);
                  const prevStatus = getPrevStatus(task.status);

                  return (
                    <div key={task.id} className="relative group">
                      <TaskItem
                        task={task}
                        course={course}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onUpdateSubtask={onUpdateSubtask}
                        onStartFocus={onStartFocus}
                      />

                      {/* Fast Move Buttons between columns */}
                      <div className="flex items-center justify-between pt-1.5 px-1">
                        {prevStatus ? (
                          <button
                            type="button"
                            onClick={() => onMoveStatus(task.id, prevStatus)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:underline"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Mundur</span>
                          </button>
                        ) : <div />}

                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => onMoveStatus(task.id, nextStatus)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline ml-auto"
                          >
                            <span>Lanjut</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : <div />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
