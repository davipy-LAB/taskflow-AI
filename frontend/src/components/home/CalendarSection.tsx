"use client";
import React, { useState, useEffect } from 'react';
import CreateAppointmentModal from './CreateAppointmentModal';
import ViewAppointmentModal from './ViewAppointmentModal'; // Novo Import
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useCalendarStore } from '@/stores/calendarStore';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CalendarSection() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Estados para Visualização
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { appointments, fetchAppointments, createAppointment, deleteAppointment } = useCalendarStore();

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const calendarDays = eachDayOfInterval({ 
        start: startOfWeek(startOfMonth(currentMonth)), 
        end: endOfWeek(endOfMonth(currentMonth)) 
    });

    return (
        <div className="bg-base-darker border border-base-lighter rounded-xl md:rounded-2xl p-3 md:p-6 shadow-xl">
            {/* Header Responsivo */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                    <div className="flex bg-base-dark rounded-lg p-1">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-base-lighter rounded-md transition-colors"><ChevronLeft className="w-5 h-5 text-white"/></button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-base-lighter rounded-md transition-colors"><ChevronRight className="w-5 h-5 text-white"/></button>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Novo</span>
                    </button>
                </div>
            </div>

            {/* Dias da Semana - Abreviação no Mobile */}
            <div className="grid grid-cols-7 mb-2 border-b border-base-lighter">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="py-2 text-center text-xs md:text-sm font-semibold text-text-muted">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-px bg-base-lighter border border-base-lighter rounded-lg overflow-hidden">
                {calendarDays.map((day, idx) => {
                    const dayApps = appointments.filter(app => isSameDay(new Date(app.date + 'T00:00:00'), day));
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <div 
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 transition-all cursor-pointer relative
                                ${isCurrentMonth ? 'bg-base-darker text-white' : 'bg-base-dark/50 text-text-muted'}
                                ${isSameDay(day, new Date()) ? 'ring-1 ring-inset ring-primary/50' : ''}
                                hover:bg-base-dark
                            `}
                        >
                            <span className={`text-xs md:text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                                {format(day, 'd')}
                            </span>
                            
                            <div className="mt-1 space-y-1">
                                {dayApps.slice(0, 3).map(app => (
                                    <div 
                                        key={app.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedApp(app);
                                            setIsViewModalOpen(true);
                                        }}
                                        className="text-[10px] md:text-xs bg-primary/20 text-primary-light border-l-2 border-primary p-1 rounded truncate hover:bg-primary/30 transition-colors"
                                    >
                                        <span className="hidden md:inline">{app.time.substring(0, 5)} </span>
                                        {app.title}
                                    </div>
                                ))}
                                {dayApps.length > 3 && (
                                    <div className="text-[9px] text-text-muted pl-1">+{dayApps.length - 3} mais</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modais */}
            <CreateAppointmentModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                selectedDate={selectedDate}
                onConfirm={async (data) => {
                    await createAppointment(data);
                    setIsCreateModalOpen(false);
                }}
            />

            <ViewAppointmentModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                appointment={selectedApp}
                onDelete={deleteAppointment}
            />
        </div>
    );
}