import type { Request, Response } from 'express';
import { db } from '../services/db.service.js';
import type { Course, ApiResponse } from '../types/index.js';

export const getCourses = (_req: Request, res: Response) => {
  const courses = Array.from(db.courses.values());
  const response: ApiResponse<Course[]> = {
    success: true,
    data: courses,
  };
  return res.status(200).json(response);
};

export const createCourse = (req: Request, res: Response) => {
  const { code, name, lecturer, sks, day, startTime, endTime, room, color, targetGrade } = req.body;

  if (!code || !name) {
    const response: ApiResponse = {
      success: false,
      error: 'Kode dan nama mata kuliah wajib diisi.',
    };
    return res.status(400).json(response);
  }

  const newCourse: Course = {
    id: `course-${Date.now()}`,
    userId: 'user-1',
    code: code.trim().toUpperCase(),
    name: name.trim(),
    lecturer: lecturer?.trim() || 'Dosen Pengampu',
    sks: Number(sks) || 3,
    day: day || 'Senin',
    startTime: startTime || '08:00',
    endTime: endTime || '10:30',
    room: room?.trim() || 'Ruang Kuliah',
    color: color || 'blue',
    targetGrade: targetGrade || 'A',
  };

  db.courses.set(newCourse.id, newCourse);

  const response: ApiResponse<Course> = {
    success: true,
    message: 'Mata kuliah berhasil ditambahkan.',
    data: newCourse,
  };
  return res.status(201).json(response);
};

export const updateCourse = (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const existing = db.courses.get(id);

  if (!existing) {
    const response: ApiResponse = {
      success: false,
      error: 'Mata kuliah tidak ditemukan.',
    };
    return res.status(404).json(response);
  }

  const updated: Course = {
    ...existing,
    ...req.body,
    id: existing.id,
  };

  db.courses.set(id, updated);

  const response: ApiResponse<Course> = {
    success: true,
    message: 'Mata kuliah berhasil diperbarui.',
    data: updated,
  };
  return res.status(200).json(response);
};

export const deleteCourse = (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!db.courses.has(id)) {
    const response: ApiResponse = {
      success: false,
      error: 'Mata kuliah tidak ditemukan.',
    };
    return res.status(404).json(response);
  }

  db.courses.delete(id);

  const response: ApiResponse = {
    success: true,
    message: 'Mata kuliah berhasil dihapus.',
  };
  return res.status(200).json(response);
};
