
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface PickupPersonFieldProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}

export function PickupPersonField({ control, setValue, getValues }: PickupPersonFieldProps) {
  const { users } = useAuth();
  
  const employeeOptions = users.map(user => ({
    value: user.id,
    label: user.name,
    description: user.position || user.department
  }));

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="pickupId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selecione quem retirou na transportadora</FormLabel>
            <FormControl>
              <SearchableSelect
                options={employeeOptions}
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value) {
                    setValue('pickupName', '');
                  }
                }}
                placeholder="Selecione um funcionário da transportadora"
                emptyMessage="Nenhum funcionário encontrado"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="pickupName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ou informe nome de quem retirou</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nome de quem retirou na transportadora"
                disabled={!!getValues().pickupId}
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.value) {
                    setValue('pickupId', '');
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
