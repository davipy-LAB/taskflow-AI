// src/stores/taskStore.ts

import { create } from 'zustand';
import api from '@/api/api'; 
import { TaskRead, TaskStatus, TaskWrite } from '../types/tasks'; 

interface TaskState {
  tasks: TaskRead[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
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
}));