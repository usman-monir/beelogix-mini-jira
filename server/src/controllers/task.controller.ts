import { Request, Response, NextFunction } from 'express';
import Task from '../models/task.model';
import Project from '../models/project.model';
import { AppError } from '../middleware/error.middleware';

// Create task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, projectId, assignee } = req.body;

    // Check if project exists and user has access
    const projectDoc = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!projectDoc) {
      return next(new AppError('Project not found or access denied', 404));
    }

    // Check if assignee is a project member
    if (!projectDoc.members.includes(assignee)) {
      return next(new AppError('Assignee must be a project member', 400));
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignee,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user._id }, { assignee: req.user._id }],
    })
      .populate('projectId', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user._id }, { assignee: req.user._id }],
    })
      .populate('projectId', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return next(new AppError('You do not have access to this project', 403));
    }

    // If updating assignee, check if new assignee is a project member
    if (req.body.assigneeId) {
      if (!project.members.includes(req.body.assigneeId)) {
        return next(new AppError('New assignee must be a project member', 400));
      }
      // Convert assigneeId to assignee for the database
      req.body.assignee = req.body.assigneeId;
      delete req.body.assigneeId;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('projectId', 'name')
      .populate('assignee', 'name email avatar');

    res.status(200).json({
      status: 'success',
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update task status
export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user._id }, { assignee: req.user._id }],
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    task.status = req.body.status;
    await task.save();

    res.status(200).json({
      status: 'success',
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return next(
        new AppError('Task not found or you are not the creator', 404)
      );
    }

    await task.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
