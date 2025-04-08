
import React from 'react';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';

interface DeliverySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function DeliverySearch({ searchTerm, setSearchTerm }: DeliverySearchProps) {
  return (
    <div className="max-w-sm w-full">
      <SearchWithMagnifier
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por cliente, minuta ou ocorrência..."
      />
    </div>
  );
}
