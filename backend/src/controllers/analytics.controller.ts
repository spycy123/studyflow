import type { Request, Response } from 'express';
import { db } from '../services/db.service.js';
import type { ApiResponse } from '../types/index.js';

const GRADE_POINTS: Record<string, number> = {
  A: 4.0,
  AB: 3.5,
  B: 3.0,
  BC: 2.5,
  C: 2.0,
  D: 1.0,
  E: 0.0,
};

export const getAnalytics = (_req: Request, res: Response) => {
  const tasks = Array.from(db.tasks.values());
  const courses = Array.from(db.courses.values());

  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;
  const urgentTasks = tasks.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done'
  ).length;
  const dueTodayTasks = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'done'
  ).length;

  let totalQualityPoints = 0;
  let totalSks = 0;

  courses.forEach((c) => {
    const points = GRADE_POINTS[c.targetGrade || 'A'] ?? 4.0;
    totalQualityPoints += points * c.sks;
    totalSks += c.sks;
  });

  const projectedIps = totalSks > 0 ? Number((totalQualityPoints / totalSks).toFixed(2)) : 0;

  const response: ApiResponse<{
    tasks: {
      total: number;
      completed: number;
      pending: number;
      urgent: number;
      dueToday: number;
      completionRatePercent: number;
    };
    academics: {
      totalCourses: number;
      totalSks: number;
      projectedIps: number;
    };
  }> = {
    success: true,
    data: {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        urgent: urgentTasks,
        dueToday: dueTodayTasks,
        completionRatePercent: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100,
      },
      academics: {
        totalCourses: courses.length,
        totalSks,
        projectedIps,
      },
    },
  };

  return res.status(200).json(response);
};
