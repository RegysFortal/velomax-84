
import { useState, useCallback } from 'react';
import { Client } from '@/types';

interface UseCompanySelectionProps {
  clients: Client[];
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
}

export function useCompanySelection({
  clients,
  setCompanyId,
  setCompanyName
}: UseCompanySelectionProps) {
  const handleCompanyChange = useCallback((newCompanyId: string) => {
    console.log("useCompanySelection - Company changed to:", newCompanyId);
    setCompanyId(newCompanyId);
    
    const selectedClient = clients.find(client => client.id === newCompanyId);
    if (selectedClient) {
      console.log("useCompanySelection - Selected client:", selectedClient.name);
      setCompanyName(selectedClient.tradingName || selectedClient.name);
    } else {
      console.warn("useCompanySelection - Client not found with ID:", newCompanyId);
    }
  }, [clients, setCompanyId, setCompanyName]);

  return {
    handleCompanyChange
  };
}
