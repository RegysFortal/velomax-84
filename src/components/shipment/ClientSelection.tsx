
import React, { useEffect } from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { Client } from "@/types";
import { FormField } from "@/components/ui/form-field";

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
  
  useEffect(() => {
    console.log("ClientSelection - Clients count:", clients.length);
    console.log("ClientSelection - Current companyId:", companyId);
  }, [clients, companyId]);
  
  return (
    <div className="space-y-2 md:col-span-2">
      <FormField id="companyName" label="Selecione um cliente">
        <ClientSearchSelect 
          value={companyId || ""}
          onValueChange={(value) => {
            console.log("ClientSelection - Cliente selecionado:", value);
            setCompanyId(value);
            const client = clients.find(c => c.id === value);
            if (client) {
              setCompanyName(client.tradingName || client.name);
              console.log("ClientSelection - Nome do cliente selecionado:", client.tradingName || client.name);
            }
          }}
          placeholder="Selecione um cliente"
          disableAutoSelect={true}
          showCreateOption={true}
          createOptionLabel="Cadastrar novo cliente"
          disabled={disabled}
          clients={clients}
        />
      </FormField>
    </div>
  );
}
