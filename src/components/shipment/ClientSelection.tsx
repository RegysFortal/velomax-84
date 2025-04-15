
import React, { useEffect } from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { useClients } from "@/contexts/clients";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const handleCompanyChange = (newCompanyId: string) => {
    console.log("ClientSelection - Company changed to:", newCompanyId);
    if (newCompanyId) {
      onCompanyChange(newCompanyId);
    }
  };
  
  // Debug output to help diagnose issues
  useEffect(() => {
    if (clients.length > 0) {
      console.log("ClientSelection - Available clients:", clients.length);
      console.log("ClientSelection - Current companyId:", companyId);
    }
  }, [clients, companyId]);
  
  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  return (
    <div className="space-y-2">
      <ClientSearchSelect
        value={companyId}
        onValueChange={handleCompanyChange}
        placeholder={loading ? "Carregando clientes..." : "Selecione o cliente"}
        disabled={isDisabled}
        clients={clients}
        showCreateOption={false}
      />
    </div>
  );
}
