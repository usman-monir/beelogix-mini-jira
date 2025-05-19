
import { useState, useEffect } from 'react';

interface DraggableOptions {
  type: string;
  item: Record<string, any>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const useDraggable = ({
  type,
  item,
  onDragStart,
  onDragEnd,
}: DraggableOptions) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    // Set the data transfer
    e.dataTransfer.setData('application/json', JSON.stringify({ type, ...item }));
    e.dataTransfer.effectAllowed = 'move';
    
    // If there's a custom callback
    onDragStart?.();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    
    // If there's a custom callback
    onDragEnd?.();
  };

  const dragAttributes = {
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };

  return {
    isDragging,
    dragAttributes,
  };
};
