// src/app/home/TaskCard.tsx
"use client";

import React, { useState } from 'react';
import { TaskRead } from '../../types/tasks'; 
import { Calendar, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStores';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { WarningDelete } from './WarningDelete';

export default function TaskCard({ task }: { task: TaskRead }) {
  const { deleteTask, updateTaskStatus } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // src/app/home/TaskCard.tsx

const handleDragEnd = (_: any, info: any) => {
  const threshold = 40; // Reduzido de 100 para 40 para ser muito mais responsivo
  const velocityThreshold = 500; // Se arrastar rápido, troca de coluna independente da distância
  
  const offset = info.offset.x;
  const velocity = info.velocity.x;

  // Lógica de Swipe para a Direita (Avançar)
  if (offset > threshold || velocity > velocityThreshold) {
    if (task.status === 'to-do') updateTaskStatus(task.id, 'in-progress');
    else if (task.status === 'in-progress') updateTaskStatus(task.id, 'done');
  } 
  // Lógica de Swipe para a Esquerda (Voltar)
  else if (offset < -threshold || velocity < -velocityThreshold) {
    if (task.status === 'done') updateTaskStatus(task.id, 'in-progress');
    else if (task.status === 'in-progress') updateTaskStatus(task.id, 'to-do');
  }
};

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-base-dark border border-base-lighter group">
        {/* Feedback visual de fundo para o Swipe */}
        <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none opacity-20">
          <ArrowLeft size={20} className="text-white" />
          <ArrowRight size={20} className="text-white" />
        </div>

        <motion.div
          style={{ x, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative z-10 bg-base-dark p-4 border-l-4 border-primary cursor-grab active:cursor-grabbing"
        >
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-text-light font-bold text-sm sm:text-base break-words flex-1">
              {task.title}
            </h3>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting}
              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
            <Calendar size={14} className="text-primary" />
            <span>{task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : 'Sem prazo'}</span>
          </div>

          {/* Dica visual Mobile */}
          <div className="mt-3 flex justify-center md:hidden">
            <div className="w-10 h-1 bg-base-lighter rounded-full opacity-20" />
          </div>
        </motion.div>
      </div>

      <WarningDelete 
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}