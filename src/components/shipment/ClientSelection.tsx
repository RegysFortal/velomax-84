
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
  
  return (
    <div className="space-y-2 w-full">
      <ClientSearchSelect
        value={companyId}
        onValueChange={onCompanyChange}
        placeholder="Selecione o cliente"
        disabled={disabled}
        clients={clients}
        showCreateOption={!disabled}
      />
    </div>
  );
}
