
import React, { useState } from 'react';

/**
 * Converte um Date para string no formato YYYY-MM-DD, respeitando o horário local
 */
function toISODateStringLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Cria um Date no horário local, fixando as 12:00h para evitar problema com UTC
 */
function createSafeLocalDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0); // 12h local
}

export default function DatePickerFix() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // formato YYYY-MM-DD
    const [year, month, day] = value.split('-').map(Number);
    const safeDate = createSafeLocalDate(year, month - 1, day);
    setSelectedDate(safeDate);
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Selecione uma data:</h2>

      <input
        type="date"
        value={selectedDate ? toISODateStringLocal(selectedDate) : ''}
        onChange={handleChange}
      />

      <div style={{ marginTop: '20px' }}>
        <strong>Data selecionada (exibição local):</strong>{' '}
        {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Nenhuma'}
        <br />
        <strong>Data salva (ISO):</strong>{' '}
        {selectedDate ? toISODateStringLocal(selectedDate) : 'Nenhuma'}
      </div>
    </div>
  );
}
