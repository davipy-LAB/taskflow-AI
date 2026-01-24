// src/stores/taskStores.ts

import { create } from 'zustand';
import api from '@/api/api'; 
import { TaskRead, TaskStatus, TaskWrite } from '../types/tasks'; 

interface TaskState {
  tasks: TaskRead[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  createTask: (task: TaskWrite) => Promise<void>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  // Adicione outras ações (addTask, updateTaskStatus, etc.)
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<TaskRead[]>('/tasks'); 
      set({ tasks: response.data, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao carregar tarefas. Verifique a API.';
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteTask: async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      // Remove a tarefa do estado após sucesso
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao deletar tarefa.';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  createTask: async (task: TaskWrite) => {
    try {
      const response = await api.post<TaskRead>('/tasks', task);
      // Adiciona a nova tarefa ao estado
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao criar tarefa.';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

updateTaskStatus: async (taskId: number, status: TaskStatus) => {
  // 1. ATUALIZAÇÃO OTIMISTA: Muda o estado local IMEDIATAMENTE
  const previousTasks = get().tasks;
  set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    ),
  }));

  try {
    // 2. Faz a chamada ao backend em background
    await api.patch<TaskRead>(`/tasks/${taskId}`, { status });
  } catch (err: any) {
    // 3. REVERSÃO: Se a API falhar, volta ao estado anterior
    set({ 
      tasks: previousTasks,
      error: 'Falha ao sincronizar com o servidor. A alteração foi revertida.' 
    });
  }
},
}));