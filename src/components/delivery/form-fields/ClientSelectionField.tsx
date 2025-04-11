
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';
import { useDeliveryFormContext } from '../context/DeliveryFormContext';
import { toast } from 'sonner';

interface ClientSelectionFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function ClientSelectionField({ control, isEditMode }: ClientSelectionFieldProps) {
  const { clients } = useDeliveryFormContext();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clients.length > 0 && !initialized) {
      console.log("ClientSelectionField - Clients loaded:", clients.length);
      setInitialized(true);
      setLoading(false);
    } else if (clients.length === 0) {
      console.log("ClientSelectionField - No clients available");
      setLoading(true);
    } else {
      setLoading(false);
    }
    
    // Log at the component level for easier debugging
    console.log("ClientSelectionField - Current clients count:", clients.length);
  }, [clients, initialized]);

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
              <ClientSearchSelect
                value={field.value}
                onValueChange={(value) => {
                  console.log("ClientSelectionField - ClientId changed to:", value);
                  field.onChange(value);
                }}
                placeholder="Selecione um cliente"
                clients={clients}
                disabled={loading || (isEditMode && field.value)}
                showCreateOption={!isEditMode}
                createOptionLabel="Cadastrar novo cliente"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
