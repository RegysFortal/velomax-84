
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientSearchSelect } from '@/components/client/ClientSearchSelect';
import { Control } from 'react-hook-form';

interface ClientSelectionFieldProps {
  control: Control<any>;
  isEditMode: boolean;
}

export function ClientSelectionField({ control, isEditMode }: ClientSelectionFieldProps) {
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
                  console.log("DeliveryFormBasicFields - ClientId changed to:", value);
                  field.onChange(value);
                }}
                placeholder="Selecione um cliente"
                disableAutoSelect={isEditMode}
                showCreateOption={true}
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
