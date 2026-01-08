// src/components/Home/CalendarSection.tsx

import React from 'react';

export default function CalendarSection() {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-white">Calendário e Agenda</h1>
            <div className="bg-base-lighter p-4 rounded-lg text-text-light min-h-[500px] shadow-xl-primary">
                <p className="text-lg font-medium">Status: Em Desenvolvimento</p>
                <p className="mt-4 text-text-muted">Esta seção será usada para gerenciar seus horários livres, agendamentos e compromissos.</p>
            </div>
        </div>
    );
}