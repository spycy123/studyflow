import { useState, useEffect, useMemo } from 'react';
import type { Task, Course, TaskStatus, UserProfile } from './types';
import {
  getCurrentUser,
  logoutUser,
  loadTasksForUser,
  saveTasksForUser,
  loadCoursesForUser,
  saveCoursesForUser,
  loadDarkModeFromStorage,
  saveDarkModeToStorage,
  resetUserToDefault,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';
import { ScheduleView } from './components/ScheduleView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { GradeCalculator } from './components/GradeCalculator';
import { TaskModal } from './components/TaskModal';
import { CourseModal } from './components/CourseModal';
import { AuthScreen } from './components/AuthScreen';
import { Plus, CheckSquare } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const user = getCurrentUser();
    return user ? loadTasksForUser(user.nim) : [];
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const user = getCurrentUser();
    return user ? loadCoursesForUser(user.nim) : [];
  });
  const [isDark, setIsDark] = useState<boolean>(loadDarkModeFromStorage);
  const [currentTab, setCurrentTab] = useState<'tasks' | 'schedule' | 'pomodoro' | 'grades'>('tasks');

  // Filter & View States
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'urgent' | 'done'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Modal States
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Active task for Pomodoro Focus
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Initialize theme class
  useEffect(() => {
    saveDarkModeToStorage(isDark);
  }, [isDark]);

  // When user logs in or switches, load their specific data
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setTasks(loadTasksForUser(user.nim));
    setCourses(loadCoursesForUser(user.nim));
    setActiveFocusTask(null);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setTasks([]);
    setCourses([]);
    setActiveFocusTask(null);
  };

  // Persist tasks & courses scoped to current user
  useEffect(() => {
    if (currentUser) {
      saveTasksForUser(currentUser.nim, tasks);
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    if (currentUser) {
      saveCoursesForUser(currentUser.nim, courses);
    }
  }, [courses, currentUser]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // Task Operations
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'done';
          return {
            ...t,
            status: isDone ? 'todo' : 'done',
            completedAt: isDone ? undefined : new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleMoveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (task: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = task;
        return updated;
      } else {
        return [task, ...prev];
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const handleUpdateSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  // Course Operations
  const handleSaveCourse = (course: Course) => {
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === course.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = course;
        return updated;
      } else {
        return [...prev, course];
      }
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleUpdateCourseGrade = (
    courseId: string,
    grade: 'A' | 'AB' | 'B' | 'BC' | 'C' | 'D' | 'E'
  ) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, targetGrade: grade } : c))
    );
  };

  // Start Focus
  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
    setCurrentTab('pomodoro');
  };

  // Data Export / Import / Reset
  const handleExportData = () => {
    const data = {
      user: currentUser,
      tasks,
      courses,
      exportedAt: new Date().toISOString(),
      appName: 'StudyFlow',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyflow-${currentUser?.nim || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (Array.isArray(content.tasks) && Array.isArray(content.courses)) {
          setTasks(content.tasks);
          setCourses(content.courses);
          alert('Data perkuliahan berhasil dipulihkan!');
        } else {
          alert('Format berkas tidak valid.');
        }
      } catch {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (!currentUser) return;
    const res = resetUserToDefault(currentUser.nim);
    setTasks(res.tasks);
    setCourses(res.courses);
    setActiveFocusTask(null);
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return tasks.filter((task) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q) || false;
        const course = courses.find((c) => c.id === task.courseId);
        const matchCourse = course?.name.toLowerCase().includes(q) || course?.code.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCourse) return false;
      }

      // Course Filter
      if (selectedCourseFilter !== 'all') {
        if (task.courseId !== selectedCourseFilter) return false;
      }

      // Status / Urgency Filter
      if (filterStatus === 'today') {
        return task.dueDate === todayStr && task.status !== 'done';
      } else if (filterStatus === 'urgent') {
        return (task.priority === 'urgent' || task.priority === 'high') && task.status !== 'done';
      } else if (filterStatus === 'done') {
        return task.status === 'done';
      }

      return true;
    }).sort((a, b) => {
      // Completed at the bottom
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;

      // Then by due date
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, courses, searchQuery, selectedCourseFilter, filterStatus]);

  const courseMap = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);

  const pendingCount = tasks.filter((t) => t.status !== 'done').length;
  const urgentCount = tasks.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done'
  ).length;

  // If user is not logged in, show Auth Screen
  if (!currentUser) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 bg-ambient-glow text-slate-800 dark:text-zinc-100 transition-colors">
      {/* Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        onOpenTaskModal={() => {
          setEditingTask(null);
          setTaskModalOpen(true);
        }}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
        taskCounts={{
          pending: pendingCount,
          urgent: urgentCount,
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Tasks & Assignments */}
        {currentTab === 'tasks' && (
          <div className="space-y-6">
            <StatsOverview
              tasks={tasks}
              courses={courses}
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedCourseFilter={selectedCourseFilter}
              setSelectedCourseFilter={setSelectedCourseFilter}
              currentUser={currentUser}
            />

            {/* View Mode: List vs Kanban */}
            {viewMode === 'list' ? (
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800">
                    <CheckSquare className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                      Tidak ada tugas yang cocok
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-md mx-auto">
                      {searchQuery
                        ? `Tidak ada hasil pencarian untuk "${searchQuery}". Coba kata kunci lain.`
                        : 'Belum ada tugas pada kategori ini. Klik tombol di bawah untuk membuat tugas baru.'}
                    </p>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setTaskModalOpen(true);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Tugas Pertama</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        course={courseMap.get(task.courseId)}
                        onToggleStatus={handleToggleTaskStatus}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setTaskModalOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onUpdateSubtask={handleUpdateSubtask}
                        onStartFocus={handleStartFocus}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <KanbanBoard
                tasks={filteredTasks}
                courses={courses}
                onToggleStatus={handleToggleTaskStatus}
                onEdit={(t) => {
                  setEditingTask(t);
                  setTaskModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                onUpdateSubtask={handleUpdateSubtask}
                onStartFocus={handleStartFocus}
                onMoveStatus={handleMoveTaskStatus}
              />
            )}
          </div>
        )}

        {/* Tab 2: Timetable / Schedule */}
        {currentTab === 'schedule' && (
          <ScheduleView
            courses={courses}
            tasks={tasks}
            onOpenCourseModal={() => {
              setEditingCourse(null);
              setCourseModalOpen(true);
            }}
            onEditCourse={(c) => {
              setEditingCourse(c);
              setCourseModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Pomodoro Focus */}
        {currentTab === 'pomodoro' && (
          <PomodoroTimer
            tasks={tasks}
            activeTask={activeFocusTask}
            onSelectActiveTask={setActiveFocusTask}
            onCompleteTask={handleToggleTaskStatus}
          />
        )}

        {/* Tab 4: GPA Simulator & Target Grades */}
        {currentTab === 'grades' && (
          <GradeCalculator
            courses={courses}
            tasks={tasks}
            onUpdateCourseGrade={handleUpdateCourseGrade}
          />
        )}
      </main>

      {/* Floating Add Task Button on Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-20">
        <button
          onClick={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        courses={courses}
        onOpenCourseModal={() => {
          setCourseModalOpen(true);
        }}
      />

      {/* Course Management Modal */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        courses={courses}
        onSaveCourse={handleSaveCourse}
        onDeleteCourse={handleDeleteCourse}
        editingCourse={editingCourse}
      />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 dark:border-zinc-800/80 text-center text-xs text-slate-400 dark:text-zinc-500">
        <p>StudyFlow • Portal & Agenda Mahasiswa ({currentUser.nim} — {currentUser.name})</p>
      </footer>
    </div>
  );
}

export default App;
