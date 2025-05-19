import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
} from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  validateRequest,
  register
);

// Login route
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

// Get current user (protected route)
router.get('/me', protect, getCurrentUser);

// Update profile (protected route)
router.patch(
  '/me',
  protect,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validateRequest,
  updateProfile
);

export default router;
