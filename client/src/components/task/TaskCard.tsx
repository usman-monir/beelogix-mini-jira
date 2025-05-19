import { Task } from '@/types';
import { formatDate, getStatusColor } from '@/utils/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDraggable } from '@/hooks/useDraggable';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { isDragging, dragAttributes } = useDraggable({
    type: 'task',
    item: { id: task.id, status: task.status },
  });

  const priorityColor = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  }[task.priority];

  return (
    <Card
      className={`task-card cursor-pointer ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => onClick(task)}
      {...dragAttributes}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-start'>
          <h3 className='font-medium text-sm'>{task.title}</h3>
          <Badge className={`text-xs ${priorityColor}`} variant='outline'>
            {task.priority}
          </Badge>
        </div>
        <p className='text-xs text-muted-foreground line-clamp-2'>
          {task.description}
        </p>
        <div className='flex items-center justify-between mt-2'>
          {task.assignee && task.assignee.name ? (
            <div className='flex items-center gap-1'>
              <Avatar className='h-5 w-5'>
                <AvatarImage
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                />
                <AvatarFallback className='text-[8px]'>
                  {getInitials(task.assignee.name)}
                </AvatarFallback>
              </Avatar>
              <span className='text-xs text-muted-foreground'>
                {task.assignee.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className='text-xs text-muted-foreground'>Unassigned</span>
          )}
          {task.dueDate && (
            <span className='text-xs text-muted-foreground'>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
