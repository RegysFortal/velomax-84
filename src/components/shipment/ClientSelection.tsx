
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
      try {
        // Call the onCompanyChange prop directly
        onCompanyChange(newCompanyId);
        console.log("ClientSelection - onCompanyChange called successfully");
      } catch (error) {
        console.error("Error in handleCompanyChange:", error);
      }
    }
  };
  
  // Debug output to help diagnose issues
  useEffect(() => {
    if (clients.length > 0) {
      console.log("ClientSelection - Available clients:", clients.length);
    }
    console.log("ClientSelection - Current companyId:", companyId);
    
    // If we have a company ID but it's not in the client list, log a warning
    if (companyId && clients.length > 0) {
      const clientExists = clients.some(client => client.id === companyId);
      if (!clientExists) {
        console.warn("ClientSelection - Warning: Selected company ID not found in client list");
      }
    }
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
