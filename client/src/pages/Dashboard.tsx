
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useProject } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/project/ProjectCard';
import CreateProjectDialog from '@/components/project/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { projects, fetchProjects, deleteProject, isLoading } = useProject();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(id);
      } catch (error) {
        // Error is handled in the context
      }
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-lg">
                <h3 className="font-medium mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first project to get started tracking tasks
                </p>
                <CreateProjectDialog />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
