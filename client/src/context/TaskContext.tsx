
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, TaskStatus } from '../types';
import { tasksApi } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, data: {
    title: string;
    description: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }) => Promise<Task>;
  updateTask: (taskId: string, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<boolean>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getTasks(projectId);
      setTasks(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (projectId: string, data: {
    title: string;
    description: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const task = await tasksApi.createTask(projectId, data);
      setTasks(prev => [...prev, task]);
      toast({
        title: "Task created",
        description: `Task "${task.title}" has been created successfully.`,
      });
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await tasksApi.updateTask(taskId, data);
      setTasks(prev =>
        prev.map(task => (task.id === taskId ? updated : task))
      );
      toast({
        title: "Task updated",
        description: `Task "${updated.title}" has been updated successfully.`,
      });
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
