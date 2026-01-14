"use client";
import { X, Calendar, Clock, AlignLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createPortal } from 'react-dom';

interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onDelete: (id: number) => void;
}

export default function ViewAppointmentModal({ isOpen, onClose, appointment, onDelete }: ViewAppointmentModalProps) {
  if (!isOpen || !appointment) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-base-darker w-full max-w-sm rounded-2xl border border-base-lighter shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white pr-4">{appointment.title}</h2>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 text-text-light">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{format(new Date(appointment.date + 'T00:00:00'), "dd 'de' MMMM", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>{appointment.time.substring(0, 5)}h</span>
            </div>
            {appointment.description && (
              <div className="flex items-start gap-3 pt-2">
                <AlignLeft className="w-5 h-5 text-primary mt-1" />
                <p className="text-sm leading-relaxed">{appointment.description}</p>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => { onDelete(appointment.id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl transition-all font-medium"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
            <button onClick={onClose} className="flex-1 bg-base-lighter hover:bg-base-light text-white py-3 rounded-xl transition-all">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}