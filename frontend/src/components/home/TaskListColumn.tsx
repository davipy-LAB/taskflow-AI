// src/app/home/TaskListColumn.tsx

import React from 'react';
import TaskCard from './TaskCard'; 
import { TaskRead } from '../../types/tasks'; 

interface TaskListColumnProps {
    title: string;
    tasks: TaskRead[];
    color: string;
}

export default function TaskListColumn({ title, tasks, color }: TaskListColumnProps) {
  
  const titleColor = `text-${color}`; 

  return (
    <div className="bg-base-lighter p-4 rounded-lg shadow-xl-primary">
      <h2 className={`text-xl font-medium mb-4 ${titleColor}`}>{title}</h2>
      
      <div className="space-y-4 min-h-[100px] p-1"> 
        
        {tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-text-muted text-sm italic p-2 text-center border border-dashed border-base-darkest rounded-md">
            Arraste tarefas para cá.
          </div>
        )}
      </div>
    </div>
  );
}