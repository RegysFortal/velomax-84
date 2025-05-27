
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface ShipmentDetailsFieldsProps {
  control: Control<any>;
}

export function ShipmentDetailsFields({ control }: ShipmentDetailsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Peso (kg) *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? '' : parseFloat(value) || 0);
                }}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="packages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volumes *</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min="1"
                placeholder="1"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? '' : parseInt(value) || 0);
                }}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
