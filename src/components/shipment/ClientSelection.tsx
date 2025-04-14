
import React, { useEffect } from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { useClients } from "@/contexts/clients";

interface ClientSelectionProps {
  companyId: string;
  onCompanyChange: (id: string) => void;
  disabled?: boolean;
}

export function ClientSelection({ 
  companyId, 
  onCompanyChange,
  disabled = false
}: ClientSelectionProps) {
  const { clients, loading } = useClients();
  
  // Prevent selection from being interactive while clients are loading
  const isDisabled = disabled || loading;
  
  return (
    <div className="space-y-2">
      <ClientSearchSelect
        value={companyId}
        onValueChange={onCompanyChange}
        placeholder={loading ? "Carregando clientes..." : "Selecione o cliente"}
        disabled={isDisabled}
        clients={clients}
      />
    </div>
  );
}
