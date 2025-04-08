
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, UseFormSetValue } from 'react-hook-form';

interface ReceiverFieldsProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

export function ReceiverFields({ control }: ReceiverFieldsProps) {
  return (
    <FormField
      control={control}
      name="receiver"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Recebedor Final</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="Nome da pessoa que recebeu a entrega final" 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
