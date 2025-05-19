
import { useState } from 'react';

interface DroppableOptions {
  accept: string | string[];
  onDrop: (item: any, event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  dropEffect?: 'none' | 'copy' | 'link' | 'move';
}

export const useDroppable = ({
  accept,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  dropEffect = 'move',
}: DroppableOptions) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.types.includes('application/json')) {
      e.dataTransfer.dropEffect = dropEffect;
      
      if (!isOver) {
        setIsOver(true);
      }
      
      // If there's a custom callback
      onDragOver?.(e);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.types.includes('application/json')) {
      setIsOver(true);
      
      // If there's a custom callback
      onDragEnter?.(e);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Make sure we're not leaving to a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setIsOver(false);
    
    // If there's a custom callback
    onDragLeave?.(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    setIsOver(false);
    
    if (e.dataTransfer.types.includes('application/json')) {
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const dataType = data.type;
        
        // Check if this drop zone accepts this type
        const acceptsType = Array.isArray(accept)
          ? accept.includes(dataType)
          : accept === dataType;
        
        if (acceptsType) {
          delete data.type; // Remove the type property
          onDrop(data, e);
        }
      } catch (error) {
        console.error('Error parsing drag data', error);
      }
    }
  };

  const dropAttributes = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return {
    isOver,
    dropAttributes,
  };
};
