
import React from 'react';
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
  return (
    <div className="space-y-2 md:col-span-2">
      <FormField id="companyName" label="Selecione um cliente">
        <ClientSearchSelect 
          value={companyId || ""}
          onValueChange={(value) => {
            console.log("ShipmentDialog - Cliente selecionado:", value);
            setCompanyId(value);
            const client = clients.find(c => c.id === value);
            if (client) {
              setCompanyName(client.name);
            }
          }}
          placeholder="Selecione um cliente"
          disableAutoSelect={false}
          showCreateOption={true}
          createOptionLabel="Cadastrar novo cliente"
          disabled={disabled}
          clients={clients}
        />
      </FormField>
    </div>
  );
}
