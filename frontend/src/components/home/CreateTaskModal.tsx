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
    status: 'to-do' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        status: formData.status,
      };

      await createTask(taskData);
      
      // Reseta o formulário e fecha o modal
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'to-do',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-lighter rounded-lg shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-light transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Marcar a reunião com a equipe"
              required
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição opcional..."
              rows={3}
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-base-dark text-text-light rounded-lg border border-base-lighter focus:border-primary focus:outline-none transition-colors"
            >
              <option value="to-do">A Fazer</option>
              <option value="in-progress">Em Progresso</option>
              <option value="done">Concluído</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
