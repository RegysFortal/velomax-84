
import React from 'react';
import { useClients } from '@/contexts';
import { SearchableSelect } from '@/components/ui/searchable-select';

export interface ClientSelectionProps {
  companyId: string;
  onCompanyChange: (id: string) => void;
}

export function ClientSelection({ companyId, onCompanyChange }: ClientSelectionProps) {
  const { clients, loading } = useClients();
  
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.tradingName || client.name,
    description: client.name
  }));
  
  return (
    <SearchableSelect
      placeholder="Selecione um cliente"
      options={clientOptions}
      value={companyId}
      onValueChange={onCompanyChange}
    />
  );
}
