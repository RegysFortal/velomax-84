
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';
import { useClients } from '@/contexts';

interface ClientSelectionFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function ClientSelectionField({ control, isEditMode }: ClientSelectionFieldProps) {
  const { clients, loading } = useClients();

  useEffect(() => {
    console.log("ClientSelectionField - Clientes disponíveis:", clients.length);
    console.log("ClientSelectionField - Modo de edição:", isEditMode);
  }, [clients, isEditMode]);

  return (
    <div className="md:col-span-2">
      <FormField
        control={control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione um cliente</FormLabel>
            <FormControl>
              <ClientSearchSelect
                value={field.value || ""}
                onValueChange={(value) => {
                  console.log("ClientSelectionField - ClientId changed to:", value);
                  field.onChange(value);
                }}
                placeholder="Selecione um cliente"
                disableAutoSelect={isEditMode}
                showCreateOption={true}
                createOptionLabel="Cadastrar novo cliente"
                clients={clients}
                disabled={loading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
