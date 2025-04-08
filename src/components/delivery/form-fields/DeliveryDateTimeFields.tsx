
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface DeliveryDateTimeFieldsProps {
  control: Control<any>;
}

export function DeliveryDateTimeFields({ control }: DeliveryDateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="deliveryDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Entrega</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="deliveryTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
