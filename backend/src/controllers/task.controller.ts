import type { Request, Response } from 'express';
import { db } from '../services/db.service.js';
import type { Task, ApiResponse } from '../types/index.js';

export const getTasks = (req: Request, res: Response) => {
  const { status, priority, courseId } = req.query;
  let tasks = Array.from(db.tasks.values());

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (courseId) {
    tasks = tasks.filter((t) => t.courseId === courseId);
  }

  const response: ApiResponse<Task[]> = {
    success: true,
    data: tasks,
  };
  return res.status(200).json(response);
};

export const createTask = (req: Request, res: Response) => {
  const { title, description, courseId, category, priority, dueDate, dueTime, subtasks, attachments } = req.body;

  if (!title || !dueDate) {
    const response: ApiResponse = {
      success: false,
      error: 'Judul dan tenggat waktu wajib diisi.',
    };
    return res.status(400).json(response);
  }

  const newTask: Task = {
    id: `task-${Date.now()}`,
    userId: 'user-1',
    title: title.trim(),
    description: description?.trim(),
    courseId: courseId || 'general',
    category: category || 'tugas',
    priority: priority || 'medium',
    status: 'todo',
    dueDate,
    dueTime,
    subtasks: Array.isArray(subtasks) ? subtasks : [],
    attachments: Array.isArray(attachments) ? attachments : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.set(newTask.id, newTask);

  const response: ApiResponse<Task> = {
    success: true,
    message: 'Tugas berhasil ditambahkan.',
    data: newTask,
  };
  return res.status(201).json(response);
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const existing = db.tasks.get(id);

  if (!existing) {
    const response: ApiResponse = {
      success: false,
      error: 'Tugas tidak ditemukan.',
    };
    return res.status(404).json(response);
  }

  const updated: Task = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.status === 'done' && existing.status !== 'done') {
    updated.completedAt = new Date().toISOString();
  }

  db.tasks.set(id, updated);

  const response: ApiResponse<Task> = {
    success: true,
    message: 'Tugas berhasil diperbarui.',
    data: updated,
  };
  return res.status(200).json(response);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  if (!db.tasks.has(id)) {
    const response: ApiResponse = {
      success: false,
      error: 'Tugas tidak ditemukan.',
    };
    return res.status(404).json(response);
  }

  db.tasks.delete(id);

  const response: ApiResponse = {
    success: true,
    message: 'Tugas berhasil dihapus.',
  };
  return res.status(200).json(response);
};
