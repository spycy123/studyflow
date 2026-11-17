import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Award,
} from 'lucide-react';
import type { UserProfile, UserRole } from '../types';
import {
  loginUser,
  registerUser,
  DEFAULT_DEMO_USER,
  DEFAULT_DEMO_PASSWORD,
  DEFAULT_DEMO_DOSEN,
  DEFAULT_DOSEN_PASSWORD,
  DEFAULT_DEMO_ADMIN,
  DEFAULT_ADMIN_PASSWORD,
} from '../utils/storage';
import { soundEffects } from '../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  isDark,
  toggleDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginNim, setLoginNim] = useState('220101034');
  const [loginPassword, setLoginPassword] = useState('mahasiswa123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register form state
  const [regRole, setRegRole] = useState<UserRole>('mahasiswa');
  const [regNim, setRegNim] = useState('');
  const [regName, setRegName] = useState('');
  const [regMajor, setRegMajor] = useState('Teknik Informatika');
  const [regSemester, setRegSemester] = useState(5);
  const [regUniversity, setRegUniversity] = useState('Universitas Indonesia');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginNim.trim() || !loginPassword.trim()) {
      setErrorMessage('NIM dan Password wajib diisi.');
      return;
    }

    const res = loginUser(loginNim.trim(), loginPassword.trim());
    if (res.success && res.user) {
      soundEffects.playTaskComplete();
      onLoginSuccess(res.user);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickDemoRole = (role: UserRole) => {
    soundEffects.playClick();
    let nim = DEFAULT_DEMO_USER.nim;
    let pwd = DEFAULT_DEMO_PASSWORD;
    if (role === 'dosen') {
      nim = DEFAULT_DEMO_DOSEN.nim;
      pwd = DEFAULT_DOSEN_PASSWORD;
    } else if (role === 'admin') {
      nim = DEFAULT_DEMO_ADMIN.nim;
      pwd = DEFAULT_ADMIN_PASSWORD;
    }
    const res = loginUser(nim, pwd);
    if (res.success && res.user) {
      soundEffects.playTaskComplete();
      onLoginSuccess(res.user);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regNim.trim()) {
      setErrorMessage('NIM wajib diisi.');
      return;
    }
    if (!regName.trim()) {
      setErrorMessage('Nama lengkap mahasiswa wajib diisi.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage('Password minimal 4 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    const avatarColors: Record<UserRole, string> = {
      mahasiswa: 'blue',
      dosen: 'emerald',
      admin: 'violet',
    };

    const newProfile: UserProfile = {
      nim: regNim.trim(),
      name: regName.trim(),
      role: regRole,
      major: regMajor.trim() || 'Umum',
      faculty: 'Fakultas ' + regMajor.trim(),
      semester: Number(regSemester) || 1,
      university: regUniversity.trim() || 'Perguruan Tinggi',
      avatarColor: avatarColors[regRole] || 'blue',
    };

    const res = registerUser(newProfile, regPassword);
    if (res.success) {
      setSuccessMessage('Akun berhasil dibuat! Silakan masuk.');
      setLoginNim(newProfile.nim);
      setLoginPassword(regPassword);
      setActiveTab('login');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-accent-100/60 dark:bg-plum-950 bg-ambient-glow p-4 sm:p-6 transition-colors">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl bg-white dark:bg-plum-900 border border-slate-200 dark:border-plum-800 text-slate-600 dark:text-accent-100 hover:border-gold-400 shadow-soft transition"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-plum-600" />}
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Illustration & Features (Desktop) */}
        <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-plum-600 to-plum-800 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-soft-lg shadow-plum-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 dark:text-accent-100 tracking-tight">
                StudyFlow
              </span>
              <p className="text-xs text-plum-600 dark:text-gold-400 font-bold">
                Portal Akademik & Produktivitas
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-accent-100 tracking-tight leading-snug">
              Atur Kuliah, Jadwal Kelas, & Target IPK Tanpa Beban.
            </h1>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              Platform modern khusus mahasiswa Indonesia untuk mencatat deadline tugas, memantau ruangan kuliah, menghitung prediksi IPS, dan belajar fokus bebas distraksi.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-plum-900/40 border border-slate-200/80 dark:border-plum-800/80 shadow-soft">
              <div className="w-8 h-8 rounded-xl bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-accent-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-accent-100">To-Do & Deadline Pintar</div>
                <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Penanda H-1, Hari Ini, dan Terlewat</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-plum-900/40 border border-slate-200/80 dark:border-plum-800/80 shadow-soft">
              <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-800 dark:bg-gold-950/60 dark:text-gold-300 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-accent-100">Jadwal Kuliah & Ruang Kelas</div>
                <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Timetable mingguan terintegrasi dosen</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-plum-900/40 border border-slate-200/80 dark:border-plum-800/80 shadow-soft">
              <div className="w-8 h-8 rounded-xl bg-accent-200 text-plum-900 dark:bg-plum-800 dark:text-accent-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-accent-100">Simulasi Target IPK / IPS</div>
                <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Kalkulasi otomatis mutu SKS semester</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-plum-900/50 border border-slate-200/80 dark:border-plum-800/80 shadow-soft-lg">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2.5 mb-6 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-plum-600 to-plum-800 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-soft">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-accent-100">
                  StudyFlow
                </span>
                <span className="text-[10px] block text-plum-600 dark:text-gold-400 font-bold">
                  Portal Mahasiswa
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex p-1 rounded-2xl bg-accent-100/90 dark:bg-plum-950/80 border border-slate-200/60 dark:border-plum-800/70 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'login'
                    ? 'bg-plum-600 text-accent-100 shadow-sm border border-gold-400/30'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
                }`}
              >
                Masuk (NIM)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === 'register'
                    ? 'bg-plum-600 text-accent-100 shadow-sm border border-gold-400/30'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-plum-900 dark:hover:text-accent-100'
                }`}
              >
                Daftar Mahasiswa Baru
              </button>
            </div>

            {/* Error or Success Banner */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-medium animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 font-medium animate-in fade-in duration-150">
                {successMessage}
              </div>
            )}

            {/* FORM 1: LOGIN */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 220101034"
                      value={loginNim}
                      onChange={(e) => setLoginNim(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Kata Sandi / Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-accent-100 bg-plum-600 hover:bg-plum-700 active:scale-[0.99] transition shadow-md shadow-plum-600/25 border border-gold-400/40 hover:border-gold-400 flex items-center justify-center gap-2"
                >
                  <span>Masuk ke Portal Kuliah</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>

                {/* Quick 1-Click Demo Login by Role */}
                <div className="pt-3 border-t border-slate-100 dark:border-plum-800/80">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                    <span>Akses Cepat Mode Demo (Pilih Role):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoRole('mahasiswa')}
                      className="py-2 px-2 rounded-xl border border-plum-300 dark:border-plum-700/80 bg-plum-50/80 dark:bg-plum-950/70 text-plum-800 dark:text-accent-100 text-xs font-semibold hover:bg-plum-100 transition flex flex-col items-center gap-0.5"
                    >
                      <span className="font-bold">Mahasiswa</span>
                      <span className="text-[9px] text-plum-600 dark:text-gold-400 font-mono">Fajar P.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoRole('dosen')}
                      className="py-2 px-2 rounded-xl border border-gold-300 dark:border-gold-700/80 bg-gold-50/80 dark:bg-gold-950/50 text-gold-900 dark:text-gold-300 text-xs font-semibold hover:bg-gold-100 transition flex flex-col items-center gap-0.5"
                    >
                      <span className="font-bold">Dosen</span>
                      <span className="text-[9px] text-gold-700 dark:text-gold-400 font-mono">Dr. Aris</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoRole('admin')}
                      className="py-2 px-2 rounded-xl border border-accent-300 dark:border-plum-600 bg-accent-100 dark:bg-plum-900/80 text-plum-950 dark:text-accent-100 text-xs font-semibold hover:bg-accent-200 transition flex flex-col items-center gap-0.5"
                    >
                      <span className="font-bold">Admin</span>
                      <span className="text-[9px] text-plum-600 dark:text-accent-300 font-mono">Akademik</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center mt-2">
                    Setiap role memiliki hak akses, profil, dan tampilan tersendiri.
                  </p>
                </div>
              </form>
            ) : (
              /* FORM 2: REGISTER */
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Daftar Sebagai (Pilihan Role) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['mahasiswa', 'dosen', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegRole(r)}
                        className={`py-1.5 px-2 rounded-xl border text-xs font-semibold capitalize transition ${
                          regRole === r
                            ? 'bg-plum-600 text-accent-100 border-gold-400 shadow-xs'
                            : 'bg-white dark:bg-plum-950 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-plum-800'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    {regRole === 'mahasiswa' ? 'NIM (Nomor Induk Mahasiswa)' : regRole === 'dosen' ? 'NIP / NIDN (Dosen)' : 'ID Administrator'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={regRole === 'mahasiswa' ? 'Contoh: 230102045' : regRole === 'dosen' ? 'Contoh: 19880101...' : 'Contoh: ADMIN002'}
                    value={regNim}
                    onChange={(e) => setRegNim(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sarah Anindya"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      placeholder="Teknik Informatika"
                      value={regMajor}
                      onChange={(e) => setRegMajor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      Semester Aktif
                    </label>
                    <select
                      value={regSemester}
                      onChange={(e) => setRegSemester(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Universitas / Kampus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Indonesia"
                    value={regUniversity}
                    onChange={(e) => setRegUniversity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 4 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      Ulangi Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Konfirmasi"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition shadow-md shadow-blue-500/20 mt-2"
                >
                  Buat Akun Mahasiswa Baru
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
