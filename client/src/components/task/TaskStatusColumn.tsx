
import { TaskStatus, Task } from '@/types';
import TaskCard from './TaskCard';
import { useDroppable } from '@/hooks/useDroppable';

interface TaskStatusColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const statusEmoji = {
  [TaskStatus.TODO]: '📋',
  [TaskStatus.IN_PROGRESS]: '⚙️',
  [TaskStatus.DONE]: '✅'
};

const TaskStatusColumn = ({ title, status, tasks, onTaskClick }: TaskStatusColumnProps) => {
  const { isOver, dropAttributes } = useDroppable({
    accept: 'task',
    onDrop: (item) => {
      console.log(`Dropped task ${item.id} to ${status}`);
      // This will be handled by the parent component
    },
    dropEffect: 'move',
  });

  return (
    <div
      className={`flex flex-col bg-muted/30 rounded-lg p-3 min-h-[300px] w-full ${
        isOver ? 'ring-2 ring-primary/30' : ''
      }`}
      {...dropAttributes}
    >
      <div className="flex items-center mb-3">
        <span className="mr-2">{statusEmoji[status]}</span>
        <h3 className="font-medium">{title}</h3>
        <div className="ml-auto bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </div>
      </div>
      <div className="space-y-3 flex-grow">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 border border-dashed border-muted-foreground/25 rounded-md bg-muted/20">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatusColumn;
