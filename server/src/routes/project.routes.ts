import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectTasks,
  getProjectMembers,
  createTask,
} from '../controllers/project.controller';
import mongoose from 'mongoose';

const router = express.Router();

// Protect all routes
router.use(protect);

// Create project
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Project description is required'),
  ],
  validateRequest,
  createProject
);

// Get all projects
router.get('/', getProjects);

// Get single project
router.get('/:id', getProject);

// Get tasks for a single project
router.get('/:id/tasks', getProjectTasks);

// Create task for a project
router.post(
  '/:id/tasks',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Task description is required'),
    body('assigneeId')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null) return true;
        return mongoose.Types.ObjectId.isValid(value);
      })
      .withMessage('Invalid assignee ID'),
  ],
  validateRequest,
  createTask
);

// Update project
router.patch(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project name cannot be empty'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project description cannot be empty'),
  ],
  validateRequest,
  updateProject
);

// Delete project
router.delete('/:id', deleteProject);

// Add project member
router.post(
  '/:id/members',
  [body('email').trim().isEmail().withMessage('Please provide a valid email')],
  validateRequest,
  addProjectMember
);

// Get project members
router.get('/:id/members', getProjectMembers);

// Remove project member
router.delete('/:id/members/:memberId', removeProjectMember);

export default router;
