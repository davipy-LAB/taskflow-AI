// src/app/home/TaskCard.tsx

"use client";

import React, { useState } from 'react';
import { TaskRead } from '../../types/tasks'; 
import { Calendar, Trash2 } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStores';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: TaskRead;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Integração com dnd-kit
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `task-${task.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  
  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
    : 'Sem data';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o drag seja acionado
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id);
      } catch (err) {
        console.error('Erro ao deletar tarefa:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const statusColors = {
    'to-do': 'border-primary text-primary',
    'in-progress': 'border-contrast text-contrast',
    'done': 'border-green-400 text-green-400',
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-base-darker rounded-lg shadow-md border-l-4 ${statusColors[task.status]} hover:shadow-lg transition-all duration-200 flex justify-between items-start group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      {...attributes}
      {...listeners}
    >
      
      <div className="flex-1">
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

      {/* Botão de Delete */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        onPointerDown={(e) => e.stopPropagation()}
        className="ml-2 p-1 text-red-400 hover:text-red-500 hover:bg-red-400/10 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Deletar tarefa"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}