import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/task.controller';

const router = express.Router();

// Protect all routes
router.use(protect);

// Create task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Task description is required'),
    body('project')
      .notEmpty()
      .withMessage('Project ID is required')
      .isMongoId()
      .withMessage('Invalid project ID'),
    body('assignee')
      .notEmpty()
      .withMessage('Assignee ID is required')
      .isMongoId()
      .withMessage('Invalid assignee ID'),
  ],
  validateRequest,
  createTask
);

// Get all tasks
router.get('/', getTasks);

// Get single task
router.get('/:id', getTask);

// Update task
router.patch(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task title cannot be empty'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task description cannot be empty'),
    body('assignee').optional().isMongoId().withMessage('Invalid assignee ID'),
  ],
  validateRequest,
  updateTask
);

// Update task status
router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Invalid status value'),
  ],
  validateRequest,
  updateTaskStatus
);

// Delete task
router.delete('/:id', deleteTask);

export default router;
