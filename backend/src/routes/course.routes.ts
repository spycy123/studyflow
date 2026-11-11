import { Router } from 'express';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller.js';

export const courseRouter = Router();

courseRouter.get('/', getCourses);
courseRouter.post('/', createCourse);
courseRouter.put('/:id', updateCourse);
courseRouter.delete('/:id', deleteCourse);
