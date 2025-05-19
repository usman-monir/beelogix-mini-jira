
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: User[];
  owner: User;
}

// Task types
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

// Form types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProjectFormValues {
  name: string;
  description: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

export interface InviteMemberFormValues {
  email: string;
}
