"use client";

import { X, Calendar, Clock, AlignLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onConfirm: (data: any) => void;
}

export default function CreateAppointmentModal({ isOpen, onClose, selectedDate, onConfirm }: CreateAppointmentModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ title, date: selectedDate, time, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-darker w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-base-lighter overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-lighter">
          <h2 className="text-xl font-bold text-white">Novo Compromisso</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form - RESTAURADO AQUI */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Título</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-base-dark border border-base-lighter rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ex: Reunião de Alinhamento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Data</label>
              <div className="flex items-center gap-2 bg-base-dark/50 p-3 rounded-lg border border-base-lighter text-text-light opacity-80">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">{selectedDate.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Horário</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-primary" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-base-dark border border-base-lighter rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Descrição (Opcional)</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-primary" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-base-dark border border-base-lighter rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-primary outline-none transition-all h-24 resize-none"
                placeholder="Detalhes do compromisso..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg-primary transition-all active:scale-[0.98] mt-4"
          >
            Agendar Compromisso
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}