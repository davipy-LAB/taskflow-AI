// src/app/home/FlowSection.tsx
"use client";

import { useTaskStore } from '../../stores/taskStores'; 
import { useEffect, useState } from 'react';
import TaskListColumn from './TaskListColumn';
import CreateTaskModal from './CreateTaskModal';
import { LayoutDashboard, Plus, AlertCircle, Loader2 } from 'lucide-react';

export default function FlowSection() {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'to-do' | 'in-progress' | 'done'>('to-do');
  
    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    // 1. Estado de Carregamento
    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="animate-pulse">Sincronizando seu fluxo...</p>
            </div>
        );
    }

    // 2. Estado de Erro
    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-white font-bold">Ops! Algo deu errado</h3>
                <p className="text-text-muted text-sm mb-4">{error}</p>
                <button onClick={() => fetchTasks()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2 gap-x-8"> 
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <LayoutDashboard size={24} />
                  </div>
                  <div>
                      <h1 className="text-2xl font-bold text-white leading-none">Meu Fluxo</h1>
                      <p className="text-text-muted text-sm mt-1">Arraste para os lados no mobile</p>
                  </div>
              </div>
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg-primary hover:brightness-110 active:scale-95 transition-all"
              >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Nova Tarefa</span>
              </button>
          </div>
            {/* Empty State */}
            {!isLoading && tasks.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-base-lighter rounded-3xl">
                    <p className="text-text-muted mb-4">Seu kanban está vazio.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-primary font-bold hover:underline">
                        Criar minha primeira tarefa
                    </button>
                </div>
            ) : (
                <>
                    {/* Tabs Mobile */}
                    <div className="flex sm:hidden bg-base-darker p-1 rounded-2xl border border-base-lighter">
                        {(['to-do', 'in-progress', 'done'] as const).map((id) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                                    activeTab === id ? 'bg-base-lighter text-white shadow-lg' : 'text-text-muted'
                                }`}
                            >
                                {id === 'to-do' ? 'A Fazer' : id === 'in-progress' ? 'Progresso' : 'Concluído'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`${activeTab === 'to-do' ? 'block' : 'hidden md:block'}`}>
                            <TaskListColumn title="A Fazer" status="to-do" color="primary" tasks={tasks.filter(t => t.status === 'to-do')} />
                        </div>
                        <div className={`${activeTab === 'in-progress' ? 'block' : 'hidden md:block'}`}>
                            <TaskListColumn title="Progresso" status="in-progress" color="contrast" tasks={tasks.filter(t => t.status === 'in-progress')} />
                        </div>
                        <div className={`${activeTab === 'done' ? 'block' : 'hidden md:block'}`}>
                            <TaskListColumn title="Concluído" status="done" color="green" tasks={tasks.filter(t => t.status === 'done')} />
                        </div>
                    </div>
                </>
            )}

            <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}