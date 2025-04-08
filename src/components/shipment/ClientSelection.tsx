
import React from 'react';
import { ClientSearchSelect } from "@/components/client/ClientSearchSelect";
import { Client } from "@/types";

interface ClientSelectionProps {
  companyId: string;
  setCompanyId: (id: string) => void;
  setCompanyName: (name: string) => void;
  clients: Client[];
}

export function ClientSelection({
  companyId,
  setCompanyId,
  setCompanyName,
  clients
}: ClientSelectionProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label htmlFor="companyName" className="text-sm font-medium">Cliente</label>
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
      />
    </div>
  );
}
