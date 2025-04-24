
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Client } from "@/types";
import { SearchableSelectOption } from "@/components/ui/searchable-select/types";

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
  const [clientOptions, setClientOptions] = useState<SearchableSelectOption[]>([]);
  const navigate = useNavigate();
  
  // Format client options
  useEffect(() => {
    try {
      if (clients && clients.length > 0) {
        console.log("ClientSearchSelect - Formatting options for", clients.length, "clients");
        
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
        
        setClientOptions(options);
        console.log("ClientSearchSelect - Formatted options:", options.length);
      } else {
        console.log("ClientSearchSelect - No clients available");
        setClientOptions([]);
      }
    } catch (error) {
      console.error("Error formatting client options:", error);
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
  
  const handleValueChange = (newValue: string) => {
    console.log("ClientSearchSelect - Value changed to:", newValue);
    
    if (newValue) {
      onValueChange(newValue);
    }
  };
  
  return (
    <div className="w-full" data-testid="client-search-select">
      <SearchableSelect
        options={clientOptions}
        value={value}
        onValueChange={handleValueChange}
        placeholder={placeholder}
        emptyMessage="Nenhum cliente encontrado"
        showCreateOption={showCreateOption}
        onCreateNew={handleCreateNewClient}
        createOptionLabel={createOptionLabel}
        disabled={disabled}
      />
    </div>
  );
}
