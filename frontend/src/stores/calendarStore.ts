import { create } from 'zustand';
import api from '@/api/api';
import { format } from 'date-fns';

interface Appointment {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
}

interface CalendarState {
  appointments: Appointment[];
  isLoading: boolean;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: { title: string; description: string; date: Date; time: string }) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  appointments: [],
  isLoading: false,

  fetchAppointments: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/calendar/');
      set({ appointments: response.data, isLoading: false });
    } catch (error) {
      console.error("Erro ao buscar compromissos:", error);
      set({ isLoading: false });
    }
  },

  createAppointment: async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || "", 
        date: format(data.date, 'yyyy-MM-dd'),
        // Garante HH:MM:SS para evitar erro 422
        time: data.time.length === 5 ? `${data.time}:00` : data.time
      };

      const response = await api.post('/calendar/', payload);
      
      // Adiciona na lista imediatamente
      set((state) => ({
        appointments: [...state.appointments, response.data]
      }));
    } catch (error: any) {
      console.error("Erro ao criar:", error.response?.data?.detail || error);
      throw error;
    }
  },

  deleteAppointment: async (id: number) => {
    try {
      await api.delete(`/calendar/${id}`);
      // Remove da lista local imediatamente (Otimista)
      set((state) => ({
        appointments: state.appointments.filter(app => app.id !== id)
      }));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }
}));