
// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format date to readable format
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get initials from name
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Helper for task status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-task-todo text-gray-700 border-gray-400';
    case 'in-progress':
      return 'bg-task-in-progress text-blue-800 border-blue-500';
    case 'done':
      return 'bg-task-done text-green-800 border-green-500';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};
