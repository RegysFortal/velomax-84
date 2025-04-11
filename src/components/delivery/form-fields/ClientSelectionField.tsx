
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { useDeliveryFormContext } from '../context/DeliveryFormContext';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Card } from '@/components/ui/card';
import { SearchWithMagnifier } from '@/components/ui/search-with-magnifier';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ClientSelectionFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function ClientSelectionField({ control, isEditMode }: ClientSelectionFieldProps) {
  const { clients } = useDeliveryFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (clients.length > 0) {
      console.log("ClientSelectionField - Clients loaded:", clients.length);
      setLoading(false);
    } else {
      console.log("ClientSelectionField - No clients available");
      setLoading(true);
    }
  }, [clients]);

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

  return (
    <div className="md:col-span-2">
      <FormField
        control={control}
        name="clientId"
        rules={{ 
          required: "Selecione um cliente" 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione um cliente</FormLabel>
            <FormControl>
              <Card className="overflow-hidden border p-0">
                <div className="border-b px-3 py-2 flex items-center">
                  <SearchWithMagnifier
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(value) => {
                      setSearchTerm(value);
                      setIsOpen(true);
                    }}
                    className="w-full"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="ml-2 text-muted-foreground"
                  >
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                {isOpen && (
                  <Command className="border-0">
                    <CommandList 
                      className="max-h-[300px] overflow-y-auto"
                      onBlur={() => setIsOpen(false)}
                    >
                      <CommandEmpty>Nenhum cliente encontrado</CommandEmpty>
                      <CommandGroup>
                        {filteredClients.map(client => (
                          <CommandItem
                            key={client.id}
                            value={client.id}
                            onSelect={(value) => {
                              console.log("ClientSelectionField - Client selected:", value);
                              field.onChange(value);
                              setIsOpen(false);
                              setSearchTerm('');
                            }}
                            className="flex items-center justify-between hover:bg-accent hover:text-accent-foreground"
                            disabled={isEditMode && field.value}
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
                            {field.value === client.id && <span className="ml-2">✓</span>}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </Card>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
