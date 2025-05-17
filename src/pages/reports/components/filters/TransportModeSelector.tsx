
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransportModeSelectorProps {
  filterMode: 'air' | 'road' | 'all';
  onModeChange: (value: 'air' | 'road' | 'all') => void;
}

export function TransportModeSelector({ 
  filterMode, 
  onModeChange 
}: TransportModeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Modo de Transporte</label>
      <Select 
        value={filterMode} 
        onValueChange={(val) => onModeChange(val as 'air' | 'road' | 'all')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o modo" />
        </SelectTrigger>
        <SelectContent className="z-50">
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="air">Aéreo</SelectItem>
          <SelectItem value="road">Rodoviário</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
