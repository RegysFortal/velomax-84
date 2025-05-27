
import React, { memo } from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeliveryFormContext } from '../context/DeliveryFormContext';

interface ClientSelectionFieldProps {
  control: Control<any>;
}

export const ClientSelectionField: React.FC<ClientSelectionFieldProps> = memo(({
  control
}) => {
  const { clients } = useDeliveryFormContext();

  console.log('ClientSelectionField rendering with', clients?.length || 0, 'clients');

  return (
    <FormField
      control={control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente *</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.tradingName || client.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Nenhum cliente encontrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

ClientSelectionField.displayName = 'ClientSelectionField';
