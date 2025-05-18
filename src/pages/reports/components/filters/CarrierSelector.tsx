
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarrierSelectorProps {
  filterCarrier: string;
  filteredCarriers: string[];
  onCarrierChange: (value: string) => void;
}

export function CarrierSelector({ 
  filterCarrier, 
  filteredCarriers,
  onCarrierChange 
}: CarrierSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Transportadora</label>
      <Select 
        value={filterCarrier} 
        onValueChange={onCarrierChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a transportadora" />
        </SelectTrigger>
        <SelectContent className="z-50 max-h-60 overflow-y-auto">
          <SelectItem value="all">Todas</SelectItem>
          {filteredCarriers.map((carrier) => (
            <SelectItem 
              key={carrier} 
              value={carrier}
            >
              {carrier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
