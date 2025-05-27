
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  const navigate = useNavigate();
  
  // Memoize client options to prevent unnecessary recalculations
  const clientOptions = useMemo<SearchableSelectOption[]>(() => {
    try {
      if (!clients || clients.length === 0) {
        console.log("ClientSearchSelect - No clients available");
        return includeAllOption ? [{ 
          value: allOptionValue, 
          label: allOptionLabel 
        }] : [];
      }
      
      console.log("ClientSearchSelect - Formatting options for", clients.length, "clients");
      
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
      
      console.log("ClientSearchSelect - Formatted options:", options.length);
      return options;
    } catch (error) {
      console.error("Error formatting client options:", error);
      return [];
    }
  }, [clients, includeAllOption, allOptionLabel, allOptionValue]);
  
  const handleCreateNewClient = useCallback(() => {
    // Store current route to return after client creation
    localStorage.setItem('velomax_return_route', window.location.pathname);
    
    // Navigate to clients page
    toast.info("Redirecionando para cadastro de novo cliente");
    navigate("/clients");
  }, [navigate]);

  const handleValueChange = useCallback((newValue: string) => {
    console.log("ClientSearchSelect - Value changed to:", newValue);
    onValueChange(newValue);
  }, [onValueChange]);
  
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
