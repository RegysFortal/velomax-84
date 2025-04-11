
import React, { useEffect, useState } from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { Client } from "@/types";
import { FormField } from "@/components/ui/form-field";
import { toast } from 'sonner';

interface ClientSelectionProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  clients: Client[];
  disabled?: boolean;
}

export function ClientSelection({
  companyId,
  setCompanyId,
  setCompanyName,
  clients,
  disabled
}: ClientSelectionProps) {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (clients.length > 0 && !initialized) {
      console.log("ClientSelection - Clients loaded:", clients.length);
      setInitialized(true);
    }
  }, [clients, initialized]);
  
  const handleClientChange = (value: string) => {
    console.log("ClientSelection - Cliente selecionado:", value);
    
    if (!value) {
      setCompanyId("");
      setCompanyName("");
      return;
    }
    
    const client = clients.find(c => c.id === value);
    if (client) {
      setCompanyId(value);
      setCompanyName(client.tradingName || client.name);
      console.log("ClientSelection - Nome do cliente selecionado:", client.tradingName || client.name);
    } else {
      console.error("Cliente não encontrado:", value);
      toast.error("Cliente não encontrado");
      setCompanyId("");
      setCompanyName("");
    }
  };
  
  return (
    <div className="space-y-2 md:col-span-2">
      <FormField id="companyName" label="Selecione um cliente" required={true}>
        <ClientSearchSelect 
          value={companyId || ""}
          onValueChange={handleClientChange}
          placeholder="Selecione um cliente"
          clients={clients}
          disabled={disabled}
          showCreateOption={true}
          createOptionLabel="Cadastrar novo cliente"
        />
      </FormField>
    </div>
  );
}
