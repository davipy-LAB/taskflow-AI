// src/app/home/TaskCard.tsx

import React from 'react';
import { TaskRead } from '../../types/tasks'; 
import { Calendar, CheckCircle } from 'lucide-react';

interface TaskCardProps {
  task: TaskRead;
}

export default function TaskCard({ task }: TaskCardProps) {
  
  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
    : 'Sem data';

  const statusColors = {
    'to-do': 'border-primary text-primary',
    'in-progress': 'border-contrast text-contrast',
    'done': 'border-green-400 text-green-400',
  };

  return (
    <div className={`p-4 bg-base-darker rounded-lg shadow-md border-l-4 ${statusColors[task.status]} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
      
      <h3 className="text-lg font-bold text-text-light truncate mb-1">
        {task.title}
      </h3>
      
      <div className="flex justify-between items-center text-xs text-text-muted mt-2">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}