
import React, { useState } from 'react';

/**
 * Cria uma data fixa no horário local, evitando erro de timezone
 * @param dateStr string no formato 'YYYY-MM-DD' vindo do input
 */
function createDateFromInput(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12); // cria no meio-dia local
}

/**
 * Converte Date para string YYYY-MM-DD (exibição no input)
 */
function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DatePickerLocal() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    const date = createDateFromInput(dateStr);
    setSelectedDate(date);
    console.log('Data salva corretamente:', date.toISOString());
  };

  return (
    <div>
      <h2>Selecionar Data Correta</h2>

      <input
        type="date"
        value={selectedDate ? formatDateToInput(selectedDate) : ''}
        onChange={handleDateChange}
      />

      {selectedDate && (
        <div style={{ marginTop: 16 }}>
          <p><strong>Exibido (pt-BR):</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
          <p><strong>Salvo (ISO):</strong> {selectedDate.toISOString()}</p>
        </div>
      )}
    </div>
  );
}
