
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface ReceiverFieldsProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

export function ReceiverFields({ control, setValue }: ReceiverFieldsProps) {
  const { users } = useAuth();
  
  const employeeOptions = users.map(user => ({
    value: user.id,
    label: user.name,
    description: user.position || user.department
  }));

  return (
    <>
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
      
      <FormField
        control={control}
        name="receiverId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ou selecione um funcionário como recebedor</FormLabel>
            <FormControl>
              <SearchableSelect
                options={employeeOptions}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value) {
                    setValue('receiver', '');
                  }
                }}
                placeholder="Selecione um funcionário que recebeu a entrega"
                emptyMessage="Nenhum funcionário encontrado"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
