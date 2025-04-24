
import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  
  // Debug which clients are available
  useEffect(() => {
    console.log("ClientSelection - Received clients:", clients.length);
    if (clients.length > 0) {
      setLoading(false);
    }
  }, [clients]);
  
  // Debug when company ID changes
  useEffect(() => {
    console.log("ClientSelection - CompanyId changed:", companyId);
  }, [companyId]);
  
  if (loading && clients.length === 0) {
    return <Skeleton className="h-10 w-full" />;
  }
  
  return (
    <div className="space-y-2 w-full">
      <ClientSearchSelect
        value={companyId}
        onValueChange={(value) => {
          console.log("ClientSelection - Value selected:", value);
          if (value) {
            onCompanyChange(value);
          }
        }}
        placeholder="Selecione o cliente"
        disabled={disabled}
        clients={clients}
        showCreateOption={!disabled}
      />
    </div>
  );
}
