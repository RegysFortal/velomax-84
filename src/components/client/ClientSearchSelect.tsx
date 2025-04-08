
import React, { useEffect, useState } from "react";
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
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  
  useEffect(() => {
    // Log para debug
    console.log("ClientSearchSelect - value atual:", value);
    console.log("ClientSearchSelect - clientes disponíveis:", clients);
    
    if (clients.length > 0) {
      // Formatar opções de cliente para o select pesquisável
      const options = [
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
      
      setClientOptions(options);
      
      // Se não houver valor selecionado e temos clientes, e não incluímos a opção "todos"
      // vamos selecionar automaticamente o primeiro cliente
      if (!value && clients.length > 0 && !includeAllOption) {
        console.log("ClientSearchSelect - Selecionando o primeiro cliente automaticamente");
        onValueChange(clients[0].id);
      }
    }
  }, [clients, includeAllOption, allOptionLabel, allOptionValue, value, onValueChange]);
  
  return (
    <SearchableSelect
      options={clientOptions}
      value={value}
      onValueChange={(newValue) => {
        console.log("ClientSearchSelect - Valor alterado para:", newValue);
        onValueChange(newValue);
      }}
      placeholder={placeholder}
      emptyMessage="Nenhum cliente encontrado"
    />
  );
}
