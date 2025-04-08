
import React, { useEffect, useState } from "react";
import { useClients } from "@/contexts/ClientsContext";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ClientSearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  disableAutoSelect?: boolean;
}

export function ClientSearchSelect({
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  includeAllOption = false,
  allOptionLabel = "Todos os clientes",
  allOptionValue = "all",
  disableAutoSelect = false
}: ClientSearchSelectProps) {
  const { clients } = useClients();
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const navigate = useNavigate();
  
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
          description: client.tradingName ? client.name : ''
        }))
      ];
      
      setClientOptions(options);
      
      // Se não houver valor selecionado e temos clientes, e não incluímos a opção "todos"
      // e não está desabilitado o auto-select, vamos selecionar automaticamente o primeiro cliente
      if (!value && clients.length > 0 && !includeAllOption && !disableAutoSelect) {
        console.log("ClientSearchSelect - Selecionando o primeiro cliente automaticamente");
        setTimeout(() => {
          onValueChange(clients[0].id);
        }, 0);
      }
    }
  }, [clients, includeAllOption, allOptionLabel, allOptionValue, value, onValueChange, disableAutoSelect]);
  
  const handleCreateNewClient = () => {
    // Salva o estado atual e navega para a página de clientes
    toast.info("Redirecionando para cadastro de novo cliente");
    navigate("/clients");
  };
  
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
      showCreateOption={true}
      onCreateNew={handleCreateNewClient}
      createOptionLabel="Cadastrar novo cliente"
    />
  );
}
