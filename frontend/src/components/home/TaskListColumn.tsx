// src/app/home/TaskListColumn.tsx

"use client";

import React from 'react';
import TaskCard from './TaskCard'; 
import { TaskRead } from '../../types/tasks';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'; 

interface TaskListColumnProps {
    title: string;
    tasks: TaskRead[];
    color: string;
}

export default function TaskListColumn({ title, tasks, color }: TaskListColumnProps) {
  
  const titleColor = `text-${color}`;
  
  // Integração com dnd-kit - drop zone
  const { setNodeRef } = useDroppable({
    id: color, // Usa a cor como ID da zona de drop (corresponde ao status)
  });

  return (
    <div ref={setNodeRef} className="bg-base-lighter p-4 rounded-lg shadow-xl-primary">
      <h2 className={`text-xl font-medium mb-4 ${titleColor}`}>{title}</h2>
      
      <SortableContext items={tasks.map(t => `task-${t.id}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4 min-h-[100px] p-1"> 
        
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-text-muted text-sm italic p-2 text-center border border-dashed border-base-darkest rounded-md">
            Arraste tarefas para cá.
          </div>
        )}
      </div>
      </SortableContext>
    </div>
  );
}