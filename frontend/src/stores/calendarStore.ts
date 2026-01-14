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
      // Usando o caminho relativo (o api.ts já deve ter o /api/v1)
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
        description: data.description || "", // FastAPI prefere string vazia a null/undefined se não for Optional
        date: format(data.date, 'yyyy-MM-dd'),
        // 🚨 O SEGREDO DO 422: O tipo 'time' do Python exige HH:MM:SS
        time: data.time.length === 5 ? `${data.time}:00` : data.time
      };

      const response = await api.post('/calendar/', payload);
      
      set((state) => ({
        appointments: [...state.appointments, response.data]
      }));
    } catch (error: any) {
      console.error("Erro 422 - Detalhes do Back-end:", error.response?.data?.detail);
      throw error;
    }
  },

  deleteAppointment: async (id: number) => {
    try {
      await api.delete(`/calendar/${id}`);
      set((state) => ({
        appointments: state.appointments.filter(app => app.id !== id)
      }));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }
}));