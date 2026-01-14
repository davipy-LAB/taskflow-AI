// src/components/home/CreateTaskModal.tsx
"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStores';
import { TaskWrite } from '@/types/tasks';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { createTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const taskData: TaskWrite = {
        title: formData.title,
        description: formData.description || undefined,
        due_date: formData.due_date || undefined,
        status: 'to-do', // Status fixo na criação
      };

      await createTask(taskData);
      setFormData({ title: '', description: '', due_date: '' });
      onClose();
    } catch (err) {
      setError('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-darker w-full max-w-md rounded-xl border border-base-lighter shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-base-lighter">
          <h2 className="text-lg font-bold text-white">Nova Tarefa</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded">{error}</p>}
          
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Título</label>
            <input
              required
              name="title"
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary outline-none transition-colors"
              placeholder="O que precisa ser feito?"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Prazo (Opcional)</label>
            <input
              type="date"
              name="due_date"
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary outline-none transition-colors [color-scheme:dark]"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-1">Descrição</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary outline-none transition-colors h-24 resize-none"
              placeholder="Detalhes da tarefa..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter hover:bg-base-lighter transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}