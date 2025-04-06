
import React from "react";
import { useClients } from "@/contexts/ClientsContext";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface ClientSearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
}

export function ClientSearchSelect({
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  includeAllOption = false,
  allOptionLabel = "Todos os clientes",
  allOptionValue = "all"
}: ClientSearchSelectProps) {
  const { clients } = useClients();
  
  // Format client options for the searchable select
  const clientOptions = [
    ...(includeAllOption ? [{ 
      value: allOptionValue, 
      label: allOptionLabel 
    }] : []),
    ...clients.map(client => ({
      value: client.id,
      label: client.tradingName || client.name,
      description: client.tradingName ? client.name : undefined
    }))
  ];
  
  return (
    <SearchableSelect
      options={clientOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      emptyMessage="Nenhum cliente encontrado"
    />
  );
}
