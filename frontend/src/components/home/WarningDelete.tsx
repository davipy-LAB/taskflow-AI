'use client';

import React from 'react';

interface WarningDeleteProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const WarningDelete: React.FC<WarningDeleteProps> = ({
  isOpen,
  title = 'Tem certeza que deseja deletar esta tarefa?',
  message = 'Esta ação não pode ser desfeita.',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-lighter rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-700">
        {/* Header com Icon de Aviso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4v2m0-6h.01M9 15h6M12 3C6.477 3 3 6.477 3 12s3.477 9 9 9 9-3.477 9-9-3.477-9-9-9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-light font-display">
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-text-muted mb-8 font-sans text-sm leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 rounded-full border-2 border-gray-600 text-text-light font-medium transition-all duration-200 hover:border-gray-500 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-red-600 text-white font-medium transition-all duration-200 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-sans"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deletando...
              </>
            ) : (
              'Deletar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
