import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, TaskStatus, User } from '@/types';
import { useTask } from '@/context/TaskContext';
import { usersApi } from '@/services/api';

interface TaskDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task?: Task;
  projectId: string;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
}

const TaskDialog = ({
  isOpen,
  setIsOpen,
  task,
  projectId,
  onTaskCreated,
  onTaskUpdated,
}: TaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [assigneeId, setAssigneeId] = useState<string>('unassigned');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { createTask, updateTask, isLoading } = useTask();

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setAssigneeId(task.assignee?.id || 'unassigned');
      } else {
        resetForm();
      }

      fetchProjectMembers();
    }
  }, [isOpen, task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(TaskStatus.TODO);
    setAssigneeId('unassigned');
    setPriority('medium');
    setErrors({});
  };

  const fetchProjectMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const members = await usersApi.getProjectMembers(projectId);
      setProjectMembers(members);
    } catch (error) {
      console.error('Failed to fetch project members', error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Task description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        const taskData = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assigneeId: assigneeId === 'unassigned' ? null : assigneeId,
        };

        if (task) {
          // Update existing task
          const updatedTask = await updateTask(task.id, taskData);
          onTaskUpdated?.(updatedTask);
        } else {
          // Create new task
          const newTask = await createTask(projectId, taskData);
          onTaskCreated?.(newTask);
        }
        setIsOpen(false);
      } catch (error) {
        // Error handled in context
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {task
                ? 'Update the details of your task.'
                : 'Add the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='title'>Task Title</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Task title'
                disabled={isLoading}
              />
              {errors.title && (
                <p className='text-sm text-destructive'>{errors.title}</p>
              )}
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Describe the task...'
                disabled={isLoading}
                rows={3}
              />
              {errors.description && (
                <p className='text-sm text-destructive'>{errors.description}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: TaskStatus) => setStatus(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='priority'>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setPriority(value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>Low</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='high'>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='assignee'>Assignee</Label>
              <Select
                value={assigneeId}
                onValueChange={setAssigneeId}
                disabled={isLoading || isLoadingMembers}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select assignee' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='unassigned'>Unassigned</SelectItem>
                  {projectMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent'></div>
                  <span>{task ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
