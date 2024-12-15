import React from 'react';

interface QuestionsCounterProps {
  selectedCount: number;
  totalCount: number;
}

export const QuestionsCounter = ({ selectedCount, totalCount }: QuestionsCounterProps) => {
  return (
    <div className="bg-[#403E43] text-white px-4 py-2 rounded-lg shadow-md">
      {selectedCount > 0 ? (
        <p className="text-center font-medium">
          {selectedCount} questão(ões) selecionada(s) de {totalCount} questões encontradas
        </p>
      ) : (
        <p className="text-center font-medium">
          {totalCount} questões encontradas
        </p>
      )}
    </div>
  );
};