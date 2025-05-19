import { User, Project, Task, TaskStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); // Debug log

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  console.log('Request headers:', headers); // Debug log

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  // Return null for 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log('Login response:', data); // Debug log
    localStorage.setItem('token', data.token);
    console.log('Token stored:', data.token); // Debug log
    return data.user;
  },

  signup: async (name: string, email: string, password: string) => {
    const { data } = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem('token', data.token);
    return data.user;
  },

  logout: async () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const { data } = await apiCall('/auth/me');
    return data.user;
  },

  updateProfile: async (name: string) => {
    const { data } = await apiCall('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
    return data.user;
  },
};

// Projects API
export const projectsApi = {
  getProjects: async () => {
    const { data } = await apiCall('/projects');
    return data.projects;
  },

  getProject: async (id: string) => {
    const { data } = await apiCall(`/projects/${id}`);
    return data.project;
  },

  createProject: async (name: string, description: string) => {
    const { data } = await apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    return data.project;
  },

  updateProject: async (
    id: string,
    data: { name?: string; description?: string }
  ) => {
    const { data: response } = await apiCall(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.project;
  },

  deleteProject: async (id: string) => {
    await apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  inviteMember: async (projectId: string, email: string) => {
    const { data } = await apiCall(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data.project;
  },
};

// Tasks API
export const tasksApi = {
  getTasks: async (projectId: string) => {
    const { data } = await apiCall(`/projects/${projectId}/tasks`);
    return data.tasks;
  },

  createTask: async (
    projectId: string,
    data: {
      title: string;
      description: string;
      status?: TaskStatus;
      assigneeId?: string;
      dueDate?: string;
      priority?: 'low' | 'medium' | 'high';
    }
  ) => {
    const { data: response } = await apiCall(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.task;
  },

  updateTask: async (
    taskId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      assigneeId?: string;
      dueDate?: string;
      priority?: 'low' | 'medium' | 'high';
    }
  ) => {
    const { data: response } = await apiCall(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.task;
  },

  deleteTask: async (taskId: string) => {
    await apiCall(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
    return true;
  },
};

// Helper to get all users for task assignment
export const usersApi = {
  getProjectMembers: async (projectId: string) => {
    const { data } = await apiCall(`/projects/${projectId}/members`);
    return data.members;
  },
};
