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

const COLUMNS: { id: TaskStatus; title: string; color: string; dot: string }[] = [
  { id: 'todo', title: 'Belum Dimulai', color: 'bg-slate-100 dark:bg-zinc-800/80', dot: 'bg-slate-400' },
  { id: 'in_progress', title: 'Sedang Dikerjakan', color: 'bg-blue-50/60 dark:bg-blue-950/20', dot: 'bg-blue-500' },
  { id: 'review', title: 'Review & Revisi', color: 'bg-amber-50/60 dark:bg-amber-950/20', dot: 'bg-amber-500' },
  { id: 'done', title: 'Selesai', color: 'bg-emerald-50/60 dark:bg-emerald-950/20', dot: 'bg-emerald-500' },
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
            className={`rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-3.5 flex flex-col min-h-[450px] ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/50 dark:border-zinc-700/40">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wide">
                  {col.title}
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 shadow-xs border border-slate-200/40 dark:border-zinc-700/40">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200/60 dark:border-zinc-800 rounded-xl">
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
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
                      <div className="flex items-center justify-between pt-1 px-1">
                        {prevStatus ? (
                          <button
                            type="button"
                            onClick={() => onMoveStatus(task.id, prevStatus)}
                            className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:underline"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Mundur</span>
                          </button>
                        ) : <div />}

                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => onMoveStatus(task.id, nextStatus)}
                            className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
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
