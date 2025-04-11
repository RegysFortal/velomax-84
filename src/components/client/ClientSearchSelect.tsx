
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Client } from "@/types";

interface ClientSearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: string;
  disableAutoSelect?: boolean;
  showCreateOption?: boolean;
  createOptionLabel?: string;
  disabled?: boolean;
  clients?: Client[];
}

export function ClientSearchSelect({
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  includeAllOption = false,
  allOptionLabel = "Todos os clientes",
  allOptionValue = "all",
  disableAutoSelect = false,
  showCreateOption = true,
  createOptionLabel = "Cadastrar novo cliente",
  disabled = false,
  clients = []
}: ClientSearchSelectProps) {
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Debug logs
  useEffect(() => {
    console.log("ClientSearchSelect - Clients count:", clients.length);
    console.log("ClientSearchSelect - Current value:", value);
  }, [clients, value]);
  
  // Format client options
  useEffect(() => {
    if (clients.length > 0) {
      // Format client options for the searchable select
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
      
      console.log("ClientSearchSelect - Formatted options:", options.length);
      console.log("ClientSearchSelect - First few options:", options.slice(0, 3));
      setClientOptions(options);
    } else {
      console.log("ClientSearchSelect - No clients available");
      setClientOptions([]);
    }
  }, [clients, includeAllOption, allOptionLabel, allOptionValue]);
  
  const handleCreateNewClient = () => {
    // Store current route to return after client creation
    localStorage.setItem('velomax_return_route', window.location.pathname);
    
    // Navigate to clients page
    toast.info("Redirecionando para cadastro de novo cliente");
    navigate("/clients");
  };
  
  return (
    <SearchableSelect
      options={clientOptions}
      value={value}
      onValueChange={(newValue) => {
        console.log("ClientSearchSelect - Value changed to:", newValue);
        onValueChange(newValue);
      }}
      placeholder={placeholder}
      emptyMessage="Nenhum cliente encontrado"
      showCreateOption={showCreateOption}
      onCreateNew={handleCreateNewClient}
      createOptionLabel={createOptionLabel}
      disabled={disabled}
    />
  );
}
