// src/components/Home/LanguageSection.tsx

import React from 'react';

export default function LanguageSection() {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-white">Aprendizado de Línguas: Old English</h1>
            <div className="bg-base-lighter p-4 rounded-lg text-text-light min-h-[500px] shadow-xl-primary">
                <p className="text-2xl font-semibold text-primary">Wæs Hæl! (Seja feliz / saúde!)</p>
                <p className="mt-4 text-text-muted">Esta seção será dedicada a módulos de vocabulário, gramática e prática de leitura em Inglês Antigo.</p>
            </div>
        </div>
    );
}