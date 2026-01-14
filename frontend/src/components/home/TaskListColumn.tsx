// src/app/home/TaskListColumn.tsx
"use client";

import React from 'react';
import TaskCard from './TaskCard'; 
import { TaskRead } from '../../types/tasks';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'; 

interface TaskListColumnProps {
    title: string;
    tasks: TaskRead[];
    color: string;
    status: 'to-do' | 'in-progress' | 'done';
}

// src/app/home/TaskListColumn.tsx
// ... (mantenha os imports e props)

export default function TaskListColumn({ title, tasks, color, status }: TaskListColumnProps) {
  const titleColor = `text-${color}`;
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-base-lighter p-4 rounded-xl shadow-xl-primary min-h-[400px] md:min-h-[600px] border border-white/5">
      <h2 className={`text-lg font-bold mb-4 flex items-center justify-between ${titleColor}`}>
        {title}
        <span className="bg-base-dark text-text-muted text-xs px-2 py-1 rounded-full border border-base-lighter">
            {tasks.length}
        </span>
      </h2>
      
      <SortableContext items={tasks.map(t => `task-${t.id}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3"> 
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="border-2 border-dashed border-base-dark p-8 rounded-xl text-center">
               <p className="text-text-muted text-xs italic">Nenhuma tarefa</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}