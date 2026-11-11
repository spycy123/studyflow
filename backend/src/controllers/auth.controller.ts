import type { Request, Response } from 'express';
import { db } from '../services/db.service.js';
import type { User, ApiResponse } from '../types/index.js';

export const login = (req: Request, res: Response) => {
  const { nim, password } = req.body;

  if (!nim || !password) {
    const response: ApiResponse = {
      success: false,
      error: 'NIM dan password wajib disertakan.',
    };
    return res.status(400).json(response);
  }

  const user = Array.from(db.users.values()).find((u) => u.nim === nim.trim());

  if (!user || user.passwordHash !== password) {
    const response: ApiResponse = {
      success: false,
      error: 'Kredensial tidak valid. Periksa kembali NIM dan password Anda.',
    };
    return res.status(401).json(response);
  }

  const response: ApiResponse<{ user: Omit<User, 'passwordHash'>; token: string }> = {
    success: true,
    message: 'Autentikasi berhasil.',
    data: {
      user: {
        id: user.id,
        nim: user.nim,
        name: user.name,
        major: user.major,
        faculty: user.faculty,
        semester: user.semester,
        university: user.university,
        createdAt: user.createdAt,
      },
      token: `demo-bearer-token-${user.id}-${Date.now()}`,
    },
  };

  return res.status(200).json(response);
};

export const register = (req: Request, res: Response) => {
  const { nim, name, major, faculty, semester, university, password } = req.body;

  if (!nim || !name || !password) {
    const response: ApiResponse = {
      success: false,
      error: 'Data registrasi tidak lengkap.',
    };
    return res.status(400).json(response);
  }

  const existing = Array.from(db.users.values()).find((u) => u.nim === nim.trim());
  if (existing) {
    const response: ApiResponse = {
      success: false,
      error: 'NIM sudah terdaftar.',
    };
    return res.status(409).json(response);
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    nim: nim.trim(),
    name: name.trim(),
    major: major?.trim() || 'Teknik Informatika',
    faculty: faculty?.trim() || 'Fakultas Ilmu Komputer',
    semester: Number(semester) || 1,
    university: university?.trim() || 'Universitas Indonesia',
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };

  db.users.set(newUser.id, newUser);

  const response: ApiResponse<{ user: Omit<User, 'passwordHash'> }> = {
    success: true,
    message: 'Pendaftaran akun mahasiswa berhasil.',
    data: {
      user: {
        id: newUser.id,
        nim: newUser.nim,
        name: newUser.name,
        major: newUser.major,
        faculty: newUser.faculty,
        semester: newUser.semester,
        university: newUser.university,
        createdAt: newUser.createdAt,
      },
    },
  };

  return res.status(201).json(response);
};
