
import React, { useEffect } from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { useClients } from "@/contexts/clients";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "@/types";

interface ClientSelectionProps {
  companyId: string;
  onCompanyChange: (id: string) => void;
  disabled?: boolean;
  clients?: Client[];
}

export function ClientSelection({ 
  companyId, 
  onCompanyChange,
  disabled = false,
  clients: propClients
}: ClientSelectionProps) {
  const { clients: contextClients, loading } = useClients();
  
  // Use clients from props if provided, otherwise use from context
  const clients = propClients || contextClients;
  
  // Prevent selection from being interactive while clients are loading
  const isDisabled = disabled || loading;
  
  const handleCompanyChange = (newCompanyId: string) => {
    console.log("ClientSelection - Company changed to:", newCompanyId);
    
    // Only update if we have a valid ID
    if (newCompanyId && newCompanyId.trim() !== '') {
      onCompanyChange(newCompanyId);
    }
  };
  
  // Debug output to help diagnose issues
  useEffect(() => {
    if (clients.length > 0) {
      console.log("ClientSelection - Available clients:", clients.length);
    }
    console.log("ClientSelection - Current companyId:", companyId);
  }, [clients, companyId]);
  
  if (loading && !propClients) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  return (
    <div className="space-y-2 w-full">
      <ClientSearchSelect
        value={companyId}
        onValueChange={handleCompanyChange}
        placeholder={loading ? "Carregando clientes..." : "Selecione o cliente"}
        disabled={isDisabled}
        clients={clients}
        showCreateOption={!disabled}
      />
    </div>
  );
}
