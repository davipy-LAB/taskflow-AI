"use client";

import React, { useState, useEffect } from 'react';
import CreateAppointmentModal from './CreateAppointmentModal';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendarStore';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarSection() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pegamos os dados e funções da Store
    const { appointments, fetchAppointments, createAppointment, deleteAppointment } = useCalendarStore();

    // Busca os dados ao carregar a página
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Gera os dias do calendário
    const calendarDays = eachDayOfInterval({ 
        start: startOfWeek(startOfMonth(currentMonth)), 
        end: endOfWeek(endOfMonth(currentMonth)) 
    });

    return (
        <div className="bg-base-darker border border-base-lighter rounded-2xl p-6 shadow-xl">
            {/* --- Cabeçalho do Calendário --- */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-base-lighter rounded-lg text-text-muted transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all font-medium"
                    >
                        <Plus className="w-4 h-4" /> Novo
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-base-lighter rounded-lg text-text-muted transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- Grid dos Dias --- */}
            <div className="grid grid-cols-7 gap-px bg-base-lighter/30 rounded-xl overflow-hidden border border-base-lighter/50">
                {calendarDays.map((day, idx) => {
                    // 🔴 A CORREÇÃO MÁGICA ESTÁ AQUI:
                    // Convertemos o dia do calendário para String YYYY-MM-DD
                    const formattedDay = format(day, 'yyyy-MM-dd');

                    // Filtramos comparando String com String
                    const dayApps = appointments?.filter(app => {
                        const appDateClean = app.date.split('T')[0];
                        return appDateClean === formattedDay;
                    }) || [];
                    
                    return (
                        <div 
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`min-h-[120px] bg-base-darker p-2 transition-all cursor-pointer hover:bg-primary/5
                                ${!isSameMonth(day, currentMonth) ? 'opacity-20' : ''}
                                ${isSameDay(day, selectedDate) ? 'ring-2 ring-inset ring-primary' : ''}
                            `}
                        >
                            {/* Número do dia */}
                            <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-primary text-white px-2 py-1 rounded-full' : 'text-text-muted'}`}>
                                {format(day, 'd')}
                            </span>
                            
                            {/* Lista de Tarefas do Dia */}
                            <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayApps.map((app) => (
                                    <div 
                                        key={app.id} 
                                        className="group relative text-[10px] bg-primary/10 text-primary p-1.5 rounded border border-primary/20 truncate transition-colors hover:bg-primary/20"
                                    >
                                        <span className="font-bold">{app.time.substring(0, 5)}</span> - {app.title}
                                        
                                        {/* Botão de Lixeira (Só aparece ao passar o mouse) */}
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); // Impede de selecionar o dia ao deletar
                                                if (app.id) deleteAppointment(app.id); 
                                            }}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center bg-red-500 text-white rounded p-1 hover:bg-red-600 shadow-sm"
                                            title="Excluir agendamento"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- Modal de Criação --- */}
            <CreateAppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                onConfirm={async (data) => {
                    await createAppointment(data);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}