// src/app/home/FlowSection.tsx

"use client";

import { useTaskStore } from '../../stores/taskStores'; 
import { useEffect, useState } from 'react';
import TaskListColumn from './TaskListColumn';
import CreateTaskModal from './CreateTaskModal';
import { DndContext, DragEndEvent } from '@dnd-kit/core'; 

export default function FlowSection() {
    const { tasks, isLoading, error, fetchTasks, updateTaskStatus } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Mapear color (usado em TaskListColumn) para status
    const colorToStatus: Record<string, 'to-do' | 'in-progress' | 'done'> = {
      'primary': 'to-do',
      'contrast': 'in-progress',
      'green': 'done',
    };

    // Handler para o drag end
    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      // Extrair task ID do formato "task-{id}"
      const taskId = parseInt(active.id.toString().split('-')[1]);
      const newStatus = colorToStatus[over.id as string];

      if (newStatus && taskId) {
        try {
          await updateTaskStatus(taskId, newStatus);
        } catch (err) {
          console.error('Erro ao atualizar status:', err);
        }
      }
    }; 

    // Filtragem das tarefas
    const tasksTodo = tasks.filter(t => t.status === 'to-do');
    const tasksInProgress = tasks.filter(t => t.status === 'in-progress');
    const tasksDone = tasks.filter(t => t.status === 'done');

    const hasTasks = tasks.length > 0; // 🚨 NOVO: Verifica se há tarefas

    return (
        <div className="space-y-8 animate-fade-in-down">
            
            {/* Cabeçalho do Kanban */}
            <div className="flex justify-between items-center pb-4 border-b border-base-lighter">
                <h1 className="text-4xl font-semibold text-white">Task Flow Kanban</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-contrast text-base-dark px-6 py-2 rounded-lg font-semibold hover:bg-contrast/90 shadow-md transition-colors duration-300"
                >
                    + Nova Task
                </button>
            </div>

            {/* Modal */}
            <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Tratamento de Estados */}
            {isLoading && <div className="text-primary text-lg animate-pulse-primary">Carregando tarefas...</div>}
            
            {/* 1. Tratamento de Erro (Visual Suave) */}
            {error && (
                <div className="p-6 bg-base-lighter rounded-xl border-l-4 border-red-500 text-red-400 shadow-xl">
                    <h3 className="text-xl font-semibold mb-2">Erro ao Carregar o Kanban 😔</h3>
                    <p className="text-sm">
                        Não foi possível carregar as tarefas: **{error}**. Verifique sua conexão ou se a rota da API está acessível.
                    </p>
                </div>
            )}
            
            {/* 2. Tratamento de Estado Vazio (Só aparece se NÃO estiver carregando, NÃO houver erro e a lista estiver vazia) */}
            {!isLoading && !error && tasks.length === 0 && (
                <div className="p-10 bg-base-lighter rounded-xl text-center border border-dashed border-base-lighter/50 shadow-xl">
                    <h3 className="text-2xl font-semibold text-primary mb-3">Seu Flow Kanban está vazio!</h3>
                    <p className="text-text-muted mb-6">
                        Comece a organizar suas tarefas criando a primeira.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                        Crie sua Primeira Task
                    </button>
                </div>
            )}
            
            {/* O Container Kanban com 3 colunas (Só aparece se houver tarefas) */}
            {!isLoading && !error && tasks.length > 0 && (
                <DndContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <TaskListColumn title={`A Fazer (${tasks.filter(t => t.status === 'to-do').length})`} tasks={tasks.filter(t => t.status === 'to-do')} color="primary" />
                    <TaskListColumn title={`Em Progresso (${tasks.filter(t => t.status === 'in-progress').length})`} tasks={tasks.filter(t => t.status === 'in-progress')} color="contrast" />
                    <TaskListColumn title={`Concluído (${tasks.filter(t => t.status === 'done').length})`} tasks={tasks.filter(t => t.status === 'done')} color="green" />
                    
                  </div>
                </DndContext>
            )}
        </div>
    );
}