// src/app/home/FlowSection.tsx

"use client";

import { useTaskStore } from '../../stores/taskStores'; 
import { useEffect } from 'react';
import TaskListColumn from './TaskListColumn'; 

export default function FlowSection() {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();
  
    useEffect(() => {
        // Busca tarefas ao carregar a seção
        fetchTasks();
    }, [fetchTasks]); 

    // Filtragem das tarefas por status para as colunas do Kanban
    const tasksTodo = tasks.filter(t => t.status === 'to-do');
    const tasksInProgress = tasks.filter(t => t.status === 'in-progress');
    const tasksDone = tasks.filter(t => t.status === 'done');

    return (
        <div className="space-y-8 animate-fade-in-down">
            
            <div className="flex justify-between items-center pb-4 border-b border-base-lighter">
                <h1 className="text-3xl font-extrabold text-white">Task Flow Kanban</h1>
                <button className="bg-contrast text-base-dark px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 shadow-glow-contrast transition-colors duration-300">
                    + Nova Task
                </button>
            </div>

            {/* Tratamento de Estados */}
            {isLoading && <div className="text-primary text-lg animate-pulse-primary">Carregando tarefas...</div>}
            
            {error && (
                <div className="bg-red-900/40 text-red-400 p-4 rounded-lg border border-red-700">
                    Erro ao carregar: {error}
                </div>
            )}
            
            {/* O Container Kanban com 3 colunas */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <TaskListColumn title={`A Fazer (${tasksTodo.length})`} tasks={tasksTodo} color="primary" />
                    <TaskListColumn title={`Em Progresso (${tasksInProgress.length})`} tasks={tasksInProgress} color="contrast" />
                    <TaskListColumn title={`Concluído (${tasksDone.length})`} tasks={tasksDone} color="green" />
                    
                </div>
            )}
        </div>
    );
}