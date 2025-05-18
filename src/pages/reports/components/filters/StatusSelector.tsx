
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShipmentStatus } from '@/types';

interface StatusSelectorProps {
  filterStatus: ShipmentStatus | 'all';
  onStatusChange: (value: ShipmentStatus | 'all') => void;
}

export function StatusSelector({ 
  filterStatus, 
  onStatusChange 
}: StatusSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Status</label>
      <Select 
        value={filterStatus} 
        onValueChange={(val) => onStatusChange(val as ShipmentStatus | 'all')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent className="z-50">
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="in_transit">Em Trânsito</SelectItem>
          <SelectItem value="retained">Retida</SelectItem>
          <SelectItem value="delivered">Retirada</SelectItem>
          <SelectItem value="partially_delivered">Entregue Parcial</SelectItem>
          <SelectItem value="delivered_final">Entregue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
