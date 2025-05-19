
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '../types';
import { projectsApi } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<Project>;
  updateProject: (id: string, data: { name?: string; description?: string }) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  inviteMember: (projectId: string, email: string) => Promise<Project>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsApi.getProjects();
      setProjects(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
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

  const createProject = async (name: string, description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const project = await projectsApi.createProject(name, description);
      setProjects(prev => [...prev, project]);
      toast({
        title: "Project created",
        description: `Project "${project.name}" has been created successfully.`,
      });
      return project;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
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

  const updateProject = async (id: string, data: { name?: string; description?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await projectsApi.updateProject(id, data);
      setProjects(prev =>
        prev.map(project => (project.id === id ? updated : project))
      );
      toast({
        title: "Project updated",
        description: `Project "${updated.name}" has been updated successfully.`,
      });
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
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

  const deleteProject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await projectsApi.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
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

  const inviteMember = async (projectId: string, email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await projectsApi.inviteMember(projectId, email);
      setProjects(prev =>
        prev.map(project => (project.id === projectId ? updated : project))
      );
      toast({
        title: "Member invited",
        description: `User with email ${email} has been invited to the project.`,
      });
      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite member';
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
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        inviteMember,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
