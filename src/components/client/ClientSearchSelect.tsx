
import React, { useEffect, useState } from "react";
import { useClients } from "@/contexts";
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
  showCreateOption?: boolean;
  createOptionLabel?: string;
  disabled?: boolean; // Added the disabled prop
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
  disabled = false // Default value added
}: ClientSearchSelectProps) {
  const { clients } = useClients();
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Debug logs to trace the component behavior
  useEffect(() => {
    console.log("ClientSearchSelect - Rendering with value:", value);
    console.log("ClientSearchSelect - Clients available:", clients.length);
    console.log("ClientSearchSelect - showCreateOption:", showCreateOption);
  }, [value, clients.length, showCreateOption]);
  
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
      
      setClientOptions(options);
      
      // Auto-select first client if conditions are met
      if (!value && clients.length > 0 && !includeAllOption && !disableAutoSelect) {
        console.log("ClientSearchSelect - Auto-selecting first client:", clients[0].id);
        // Use setTimeout to ensure this happens after render
        setTimeout(() => {
          onValueChange(clients[0].id);
        }, 0);
      }
    }
  }, [clients, includeAllOption, allOptionLabel, allOptionValue, value, onValueChange, disableAutoSelect]);
  
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
      disabled={disabled} // Pass the disabled prop to SearchableSelect
    />
  );
}
