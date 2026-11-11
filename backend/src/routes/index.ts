import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { taskRouter } from './task.routes.js';
import { courseRouter } from './course.routes.js';
import { analyticsRouter } from './analytics.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/analytics', analyticsRouter);
