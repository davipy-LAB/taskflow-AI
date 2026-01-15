"use client";

import { useTaskStore } from '../../stores/taskStores'; 
import { useEffect, useState } from 'react';
import TaskListColumn from './TaskListColumn';
import CreateTaskModal from './CreateTaskModal';
import api from '@/api/api'; 
import { LayoutDashboard, Plus, AlertCircle, Loader2, Zap } from 'lucide-react';

export default function FlowSection() {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'to-do' | 'in-progress' | 'done'>('to-do');
    
    // Estados para controlar o despertar do backend
    const [isBackendAwake, setIsBackendAwake] = useState(false);
    const [retries, setRetries] = useState(0);

    // Lógica para verificar se o backend no Render acordou antes de carregar o site
    useEffect(() => {
        let isMounted = true;

        const checkBackend = async () => {
            try {
                // Tenta pingar o endpoint de saúde que criamos no main.py
                await api.get('/health');
                if (isMounted) {
                    setIsBackendAwake(true);
                    fetchTasks(); // Só busca as tarefas após o sucesso
                }
            } catch (err) {
                if (isMounted) {
                    console.log("Servidor em standby... tentando reconectar.");
                    setRetries((prev) => prev + 1);
                    setTimeout(checkBackend, 3000); // Tenta novamente em 3 segundos
                }
            }
        };

        checkBackend();
        return () => { isMounted = false; };
    }, [fetchTasks]);

    // 1. Tela de Espera (Exibida enquanto o Render acorda o servidor)
    if (!isBackendAwake) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[450px] text-center p-6">
                <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
                    <Zap className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Conectando ao Fluxo AI</h2>
                <p className="text-text-muted text-sm max-w-xs mx-auto">
                    O servidor está a iniciar. Como é um serviço gratuito, o primeiro acesso pode demorar até 30 segundos.
                </p>
                <p className="mt-4 text-[10px] text-primary/40 font-mono tracking-widest uppercase">
                    Tentativa de conexão: {retries}
                </p>
            </div>
        );
    }

    // 2. Estado de Carregamento de Dados (Original)
    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="animate-pulse">Sincronizando seu fluxo...</p>
            </div>
        );
    }

    // 3. Estado de Erro (Original)
    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-red-500 font-bold mb-2">Erro de Sincronização</h2>
                <p className="text-text-muted mb-4">{error}</p>
                <button onClick={() => fetchTasks()} className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors">
                    Tentar Novamente
                </button>
            </div>
        );
    }

    // 4. Renderização do Layout (Original Intocado)
    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <LayoutDashboard className="text-primary" /> Meu Fluxo
                </h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary p-2 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="text-white" />
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-20 bg-base-lighter rounded-3xl border-2 border-dashed border-white/5">
                    <p className="text-text-muted mb-6">Você ainda não tem tarefas no seu fluxo.</p>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">
                        Criar minha primeira tarefa
                    </button>
                </div>
            ) : (
                <>
                    {/* Tabs para Mobile */}
                    <div className="flex md:hidden bg-base-dark p-1 rounded-xl mb-6 border border-white/5">
                        {(['to-do', 'in-progress', 'done'] as const).map((id) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === id ? 'bg-base-lighter text-white shadow-lg' : 'text-text-muted'
                                }`}
                            >
                                {id === 'to-do' ? 'A Fazer' : id === 'in-progress' ? 'Progresso' : 'Concluído'}
                            </button>
                        ))}
                    </div>

                    {/* Grid de Colunas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={activeTab === 'to-do' ? 'block' : 'hidden md:block'}>
                            <TaskListColumn title="A Fazer" status="to-do" color="primary" tasks={tasks.filter(t => t.status === 'to-do')} />
                        </div>
                        <div className={activeTab === 'in-progress' ? 'block' : 'hidden md:block'}>
                            <TaskListColumn title="Progresso" status="in-progress" color="contrast" tasks={tasks.filter(t => t.status === 'in-progress')} />
                        </div>
                        <div className={activeTab === 'done' ? 'block' : 'hidden md:block'}>
                            <TaskListColumn title="Concluído" status="done" color="green" tasks={tasks.filter(t => t.status === 'done')} />
                        </div>
                    </div>
                </>
            )}

            <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}