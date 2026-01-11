// src/components/Home/CalendarSection.tsx
"use client";

import React, { useState } from 'react';
import CreateAppointmentModal from './CreateAppointmentModal'; // 1. Certifique-se do import
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarSection() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // 2. ADICIONE ESTE ESTADO para controlar a visibilidade do modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // 3. ADICIONE ESTA FUNÇÃO para lidar com a confirmação (preparação para o POST)
    const handleConfirmAppointment = (data: any) => {
        console.log("Novo compromisso agendado:", data);
        // Aqui entrará a lógica do POST /appointments futuramente
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-fade-in-down">
            {/* Cabeçalho do Calendário */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center pb-4 border-b border-base-lighter">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </h1>
                    <div className="flex bg-base-darker rounded-lg border border-base-lighter">
                        <button onClick={prevMonth} className="p-2 hover:text-primary transition-colors"><ChevronLeft /></button>
                        <button onClick={nextMonth} className="p-2 hover:text-primary transition-colors"><ChevronRight /></button>
                    </div>
                </div>
                
                {/* 4. ATUALIZE O ONCLICK do botão para abrir o modal */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Novo Compromisso
                </button>
            </div>

            {/* Grid do Calendário */}
            <div className="bg-base-lighter rounded-xl shadow-xl-primary overflow-hidden border border-base-lighter/50">
                {/* ... (código dos dias da semana e dias do mês permanece igual) ... */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`min-h-[80px] sm:min-h-[120px] p-2 border-b border-r border-base-lighter/30 cursor-pointer transition-all
                                ${!isSameMonth(day, monthStart) ? 'bg-base-dark/20 text-text-muted/30' : 'text-text-light hover:bg-primary/5'}
                                ${isSameDay(day, new Date()) ? 'bg-primary/10' : ''}
                                ${isSameDay(day, selectedDate) ? 'ring-2 ring-inset ring-primary' : ''}
                            `}
                        >
                            <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-primary text-white px-2 py-1 rounded-full' : ''}`}>
                                {format(day, 'd')}
                            </span>
                            
                            <div className="mt-2 space-y-1">
                                {isSameDay(day, new Date()) && (
                                    <div className="text-[10px] bg-contrast/20 text-contrast p-1 rounded border border-contrast/30 truncate">
                                        Exemplo: Reunião
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. INSERIR O MODAL AQUI (fora do grid para evitar problemas de z-index) */}
            <CreateAppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                onConfirm={handleConfirmAppointment}
            />
        </div>
    );
}