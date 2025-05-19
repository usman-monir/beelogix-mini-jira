import mongoose, { Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export interface ITask extends mongoose.Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: Types.ObjectId;
  assignee: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for better query performance
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
