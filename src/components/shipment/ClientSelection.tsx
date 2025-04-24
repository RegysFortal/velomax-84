
import React from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
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
  clients = []
}: ClientSelectionProps) {
  if (!clients || clients.length === 0) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  const handleClientChange = (selectedId: string) => {
    console.log("ClientSelection - Client selected with ID:", selectedId);
    onCompanyChange(selectedId);
  };
  
  return (
    <div className="space-y-2 w-full">
      <ClientSearchSelect
        value={companyId}
        onValueChange={handleClientChange}
        placeholder="Selecione o cliente"
        disabled={disabled}
        clients={clients}
        showCreateOption={!disabled}
      />
    </div>
  );
}
