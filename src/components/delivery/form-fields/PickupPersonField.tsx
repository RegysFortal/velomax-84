
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form';

interface PickupPersonFieldProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
}

export function PickupPersonField({ control }: PickupPersonFieldProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="pickupName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome de quem retirou</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Nome de quem retirou na transportadora"
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="pickupDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Retirada</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="pickupTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora da Retirada</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
