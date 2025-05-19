import { Project } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getInitials, truncateText } from '@/utils/helpers';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  return (
    <Card className='overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg'>{project.name}</CardTitle>
        <CardDescription className='text-xs text-muted-foreground'>
          Created {formatDate(project.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className='pb-2 flex-grow'>
        <p className='text-sm text-muted-foreground mb-4'>
          {truncateText(project.description, 100)}
        </p>
        <div className='flex flex-wrap gap-1'>
          {project.members.length > 0 && (
            <div className='flex -space-x-2 overflow-hidden'>
              {project.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  className='h-6 w-6 border-2 border-background'
                >
                  <AvatarImage
                    src={member.avatar}
                    alt={member.name || 'Member'}
                  />
                  <AvatarFallback className='text-[10px]'>
                    {member.name ? getInitials(member.name) : '?'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 3 && (
                <div className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium'>
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='pt-2 flex justify-between'>
        <Button asChild variant='default' size='sm'>
          <Link to={`/projects/${project.id}`}>View Details</Link>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onDelete(project.id)}
          className='text-destructive hover:text-destructive hover:bg-destructive/10'
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
