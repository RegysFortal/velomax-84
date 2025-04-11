
import React, { useEffect, useState } from 'react';
import { Client } from "@/types";
import { FormField } from "@/components/ui/form-field";
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

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
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  
  useEffect(() => {
    if (clients.length > 0 && !initialized) {
      console.log("ClientSelection - Clients loaded:", clients.length);
      setInitialized(true);
    }
  }, [clients, initialized]);
  
  // Set selected client name when companyId changes (for initial values)
  useEffect(() => {
    if (companyId) {
      const client = clients.find(c => c.id === companyId);
      if (client) {
        setSelectedClientName(client.tradingName || client.name);
      }
    } else {
      setSelectedClientName(null);
    }
  }, [companyId, clients]);
  
  const filteredClients = clients.filter(client => {
    const searchFields = [
      client.tradingName || '',
      client.name || '',
      client.document || '',
      client.phone || '',
      client.email || ''
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });
  
  const handleClientChange = (clientId: string) => {
    console.log("ClientSelection - Cliente selecionado:", clientId);
    
    if (!clientId) {
      setCompanyId("");
      setCompanyName("");
      setSelectedClientName(null);
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setCompanyId(clientId);
      setCompanyName(client.tradingName || client.name);
      setSelectedClientName(client.tradingName || client.name);
      setIsOpen(false);
      setSearchTerm('');
      console.log("ClientSelection - Nome do cliente selecionado:", client.tradingName || client.name);
    } else {
      console.error("Cliente não encontrado:", clientId);
      toast.error("Cliente não encontrado");
      setCompanyId("");
      setCompanyName("");
      setSelectedClientName(null);
    }
  };
  
  return (
    <div className="space-y-2 md:col-span-2">
      <FormField id="companyName" label="Selecione um cliente" required={true}>
        <Card className="overflow-hidden border p-0">
          <div className="border-b px-3 py-2 flex items-center">
            {selectedClientName && !isOpen ? (
              <div className="flex-1 py-2 px-1 font-medium">
                {selectedClientName}
              </div>
            ) : (
              <SearchWithMagnifier
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setIsOpen(true);
                }}
                placeholder="Selecione um cliente"
                className="w-full"
              />
            )}
            <button 
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                if (!isOpen && selectedClientName) {
                  setSearchTerm('');
                }
              }}
              className="ml-2 text-muted-foreground"
              disabled={disabled}
            >
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          
          {isOpen && (
            <Command className="border-0">
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>Nenhum cliente encontrado</CommandEmpty>
                <CommandGroup>
                  {filteredClients.map(client => (
                    <CommandItem
                      key={client.id}
                      value={client.id}
                      onSelect={handleClientChange}
                      className="flex items-center justify-between hover:bg-accent hover:text-accent-foreground"
                      disabled={disabled}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {client.tradingName || client.name}
                        </span>
                        {client.tradingName && (
                          <span className="text-xs text-muted-foreground">
                            {client.name}
                          </span>
                        )}
                      </div>
                      {companyId === client.id && <Check className="h-4 w-4" />}
                    </CommandItem>
                  ))}
                  
                  {/* Opção para criar novo cliente */}
                  <CommandItem
                    value="create-new"
                    onSelect={() => {
                      // Implementação para criar novo cliente, mantida para compatibilidade
                      console.log("Criar novo cliente");
                    }}
                    className="border-t mt-2 pt-2 font-medium text-primary"
                    disabled={disabled}
                  >
                    Cadastrar novo cliente
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </Card>
      </FormField>
    </div>
  );
}
