"use client";

import { X, Calendar, Clock, AlignLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-base-darker w-full max-w-md rounded-2xl shadow-2xl border border-base-lighter overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-base-lighter">
          <h2 className="text-xl font-bold text-white">Novo Agendamento</h2>
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body com Scroll para mobile */}
        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Título</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-base-dark border border-base-lighter rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ex: Reunião de Design"
            />
          </div>

          {/* Grid Responsivo: 1 coluna no mobile, 2 no desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Data</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-primary" />
                <input
                  disabled
                  type="text"
                  value={format(selectedDate, 'dd/MM/yyyy')}
                  className="w-full bg-base-dark/50 border border-base-lighter rounded-lg p-3 pl-10 text-white cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Horário</label>
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
            <label className="block text-sm font-medium text-text-muted mb-1.5">Descrição (Opcional)</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-primary" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-base-dark border border-base-lighter rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-primary outline-none transition-all h-24 resize-none"
                placeholder="Detalhes adicionais..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 order-2 sm:order-1 bg-base-lighter hover:bg-base-light text-white font-medium py-3 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 order-1 sm:order-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}