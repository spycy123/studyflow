import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckSquare } from 'lucide-react';
import type { Task } from '../types';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  tasks: Task[];
  activeTask: Task | null;
  onSelectActiveTask: (task: Task | null) => void;
  onCompleteTask: (taskId: string) => void;
}

type Mode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<Mode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  activeTask,
  onSelectActiveTask,
  onCompleteTask,
}) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  const noiseNodeRef = useRef<AudioNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Timer countdown loop
  useEffect(() => {
    let interval: any = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      soundEffects.playTimerComplete();

      if (mode === 'focus') {
        setSessionsCompleted((s) => s + 1);
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
        });
        setMode('shortBreak');
        setTimeLeft(MODE_TIMES.shortBreak);
      } else {
        setMode('focus');
        setTimeLeft(MODE_TIMES.focus);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const toggleTimer = () => {
    soundEffects.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    soundEffects.playClick();
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  // Toggle ambient pink/brown noise (study sound) via Web Audio API
  const toggleAmbientNoise = () => {
    if (isAmbientPlaying) {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      setIsAmbientPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Generate gentle rain/brown noise buffer
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5; // Gain multiplier
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 450;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        noiseNodeRef.current = whiteNoise;
        setIsAmbientPlaying(true);
      } catch (e) {
        console.error('Audio init failed', e);
      }
    }
  };

  // Cleanup audio node on unmount
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTimeForMode = MODE_TIMES[mode];
  const progressPercent = ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100;

  const incompleteTasks = tasks.filter((t) => t.status !== 'done');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft max-w-md mx-auto">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            mode === 'focus'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
          }`}
        >
          Fokus Nugas (25m)
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
          }`}
        >
          Istirahat (5m)
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
            mode === 'longBreak'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
          }`}
        >
          Istirahat Panjang (15m)
        </button>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft-lg text-center relative overflow-hidden">
        {/* Subtle Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-1000 ${
              mode === 'focus'
                ? 'bg-blue-600'
                : mode === 'shortBreak'
                ? 'bg-emerald-500'
                : 'bg-purple-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ambient Noise Button (Top Right) */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleAmbientNoise}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isAmbientPlaying
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
            }`}
            title="Suara desau lembut peredam distraksi (Rain / Brown Noise)"
          >
            {isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isAmbientPlaying ? 'Derau Suara Aktif' : 'Suara Hening/Fokus'}
            </span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-medium mb-6">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
            }`}
          />
          <span>
            {mode === 'focus'
              ? 'Waktu Fokus Penuh — Singkirkan HP & Sosmed'
              : 'Rehat Sejenak — Minum Air & Peregangan'}
          </span>
        </div>

        {/* Digital Clock */}
        <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white select-none mb-8">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md active:scale-95 transition flex items-center gap-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Fokus</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 transition"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-zinc-400">
          <div>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {sessionsCompleted}
            </span>{' '}
            Sesi Fokus Selesai
          </div>
          <div>•</div>
          <div>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {sessionsCompleted * 25}
            </span>{' '}
            Menit Belajar Intensif
          </div>
        </div>
      </div>

      {/* Target Task Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            Tugas yang Sedang Dikerjakan
          </h3>

          {activeTask && (
            <button
              onClick={() => onSelectActiveTask(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
            >
              Ganti Tugas
            </button>
          )}
        </div>

        {activeTask ? (
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Fokus Aktif
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {activeTask.title}
              </h4>
              {activeTask.description && (
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1">
                  {activeTask.description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                onCompleteTask(activeTask.id);
                soundEffects.playTaskComplete();
                confetti();
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
            >
              Tandai Selesai
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
              Pilih salah satu tugas di bawah untuk ditautkan dengan sesi fokus ini:
            </p>
            {incompleteTasks.length === 0 ? (
              <div className="text-xs text-slate-400 italic">
                Semua tugas perkuliahan sudah selesai! Kerja bagus 🎉
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {incompleteTasks.slice(0, 6).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectActiveTask(task)}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer flex items-center justify-between transition text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-zinc-200 truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Pilih
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
