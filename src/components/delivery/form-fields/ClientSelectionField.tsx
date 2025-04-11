
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';
import { useClients } from '@/contexts';
import { toast } from 'sonner';

interface ClientSelectionFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function ClientSelectionField({ control, isEditMode }: ClientSelectionFieldProps) {
  const { clients, loading } = useClients();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (clients.length > 0 && !initialized) {
      console.log("ClientSelectionField - Clientes carregados:", clients.length);
      setInitialized(true);
    }
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
                  field.onBlur();
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
