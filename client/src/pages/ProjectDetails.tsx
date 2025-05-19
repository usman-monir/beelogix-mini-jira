import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTask } from '@/context/TaskContext';
import { projectsApi } from '@/services/api';
import { Project, Task, TaskStatus } from '@/types';
import TaskStatusColumn from '@/components/task/TaskStatusColumn';
import TaskDialog from '@/components/task/TaskDialog';
import InviteMemberDialog from '@/components/project/InviteMemberDialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials, formatDate } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    tasks,
    fetchTasks,
    updateTask,
    isLoading: isLoadingTasks,
  } = useTask();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchTasks(projectId);
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    if (projectId) {
      try {
        setIsLoadingProject(true);
        const projectData = await projectsApi.getProject(projectId);
        setProject(projectData);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch project details';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProject(false);
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: TaskStatus
  ) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      // Error is handled in the context
    }
  };

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter(
    (task) => task.status === TaskStatus.IN_PROGRESS
  );
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  // Handle drag and drop
  const handleDrop = (taskId: string, status: TaskStatus) => {
    handleTaskStatusChange(taskId, status);
  };

  if (isLoadingProject) {
    return (
      <Layout>
        <div className='container py-8 animate-pulse'>
          <div className='h-8 w-64 bg-muted mb-4 rounded'></div>
          <div className='h-4 w-96 bg-muted/70 mb-8 rounded'></div>
          <div className='grid grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-64 bg-muted rounded-lg'></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className='container py-8'>
          <h1 className='text-3xl font-bold mb-4'>Project not found</h1>
          <p className='mb-6'>
            The project you're looking for doesn't exist or you don't have
            access.
          </p>
          <Button asChild>
            <Link to='/dashboard'>Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='container py-8'>
        {/* Project Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Link
                to='/dashboard'
                className='text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                Dashboard
              </Link>
              <span className='text-muted-foreground'>/</span>
              <span className='text-sm'>{project.name}</span>
            </div>
            <h1 className='text-3xl font-bold'>{project.name}</h1>
          </div>
          <div className='flex items-center gap-3'>
            <InviteMemberDialog projectId={project.id} />
            <Button onClick={handleNewTask}>Add New Task</Button>
          </div>
        </div>

        {/* Project Info */}
        <div className='mb-8 p-4 bg-muted/30 rounded-lg'>
          <p className='text-muted-foreground mb-4'>{project.description}</p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Team:</span>
              <div className='flex -space-x-2'>
                <Avatar className='h-7 w-7 border-2 border-background'>
                  <AvatarImage
                    src={project.owner.avatar}
                    alt={project.owner.name}
                  />
                  <AvatarFallback>
                    {getInitials(project.owner.name)}
                  </AvatarFallback>
                </Avatar>
                {project.members.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className='h-7 w-7 border-2 border-background'
                  >
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className='flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium'>
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <div>
                <span>Created: </span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div>
                <span>Last updated: </span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <TaskStatusColumn
              title='To Do'
              status={TaskStatus.TODO}
              tasks={todoTasks}
              onTaskClick={handleTaskClick}
            />
          </div>
          <div>
            <TaskStatusColumn
              title='In Progress'
              status={TaskStatus.IN_PROGRESS}
              tasks={inProgressTasks}
              onTaskClick={handleTaskClick}
            />
          </div>
          <div>
            <TaskStatusColumn
              title='Done'
              status={TaskStatus.DONE}
              tasks={doneTasks}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>

        {/* Task Dialog */}
        {projectId && (
          <TaskDialog
            isOpen={isTaskDialogOpen}
            setIsOpen={setIsTaskDialogOpen}
            task={selectedTask}
            projectId={projectId}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetails;
