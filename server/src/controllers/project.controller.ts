import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import Task from '../models/task.model';

// Create project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate('owner', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single project
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return next(
        new AppError('Project not found or you are not the owner', 404)
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        project: updatedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return next(
        new AppError('Project not found or you are not the owner', 404)
      );
    }

    await project.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Add project member
export const addProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return next(
        new AppError('Project not found or you are not the owner', 404)
      );
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (project.members.includes(user._id)) {
      return next(new AppError('User is already a member', 400));
    }

    project.members.push(user._id);
    await project.save();

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Remove project member
export const removeProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return next(
        new AppError('Project not found or you are not the owner', 404)
      );
    }

    if (req.params.memberId === req.user._id.toString()) {
      return next(new AppError('Cannot remove project owner', 400));
    }

    project.members = project.members.filter(
      (member) => member.toString() !== req.params.memberId
    );
    await project.save();

    res.status(200).json({
      status: 'success',
      data: {
        project,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get tasks for a single project
export const getProjectTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id }).populate(
      'assignee',
      'name email avatar'
    );

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

// Get project members
export const getProjectMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members',
      'name email'
    );

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if the current user is a member or owner of the project
    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );
    const isOwner = project.owner.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
      return next(
        new AppError(
          'You are not authorized to view members of this project',
          403
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        members: project.members,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create task for a project
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, assigneeId, priority } = req.body;
    const projectId = req.params.id;

    // Check if project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) {
      return next(new AppError('Project not found or access denied', 404));
    }

    // Check if assignee is a project member if assignee is provided
    if (assigneeId && !project.members.includes(assigneeId)) {
      return next(new AppError('Assignee must be a project member', 400));
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      projectId,
      assignee: assigneeId || null,
      priority: priority || 'medium',
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
